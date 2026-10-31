import Admission from "../model/admissionModel.js";
import nodemailer from "nodemailer";
import Notification from "../model/Notification.js";

// ==========================================
// aaPanel Mail Server Transporter Setup
// ==========================================
const transporter = nodemailer.createTransport({
  host: "mail.madrasatuzzaytuna.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ==========================================
// 1. Update Status & Send Offer Code API
// ==========================================
export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).send({
        success: false,
        message: "Application not found",
      });
    }

    let currentOfferCode = admission.offerCode;

    if (status === "Accepted" && admission.status !== "Accepted") {
      currentOfferCode = Math.floor(100000 + Math.random() * 900000).toString();

      const recipientEmail = admission.familyInfo?.email;
      console.log("📨 Attempting to send email to:", recipientEmail);

      const mailOptions = {
        from: `"Madrasatuz Zaytuna International" <${process.env.SMTP_EMAIL}>`,
        to: recipientEmail,
        subject: "Application Approved - Final Admission Offer Code",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">Congratulations!</h2>
            <p style="color: #334155; font-size: 16px;">Dear Parent,</p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              We are delighted to inform you that the pre-admission application for <strong>${admission.childInfo.fullName}</strong> (ID: ${admission.applicationId}) has been <strong>Approved</strong>.
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              To complete the final admission process, please log in to your dashboard and enter the following highly confidential Offer Code when prompted:
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <span style="font-size: 28px; font-weight: bold; background: #ecfdf5; color: #064e3b; padding: 15px 30px; border-radius: 8px; border: 2px dashed #10b981; letter-spacing: 5px;">
                ${currentOfferCode}
              </span>
            </div>
            
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Please keep this code secure. We look forward to welcoming you to our Madrasah.
            </p>
            <br/>
            <p style="color: #64748b; font-size: 14px;">
              Warm regards,<br/>
              <strong style="color: #0f172a;">Madrasatuz Zaytuna International</strong>
            </p>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully Response:", info.response);
      } catch (mailError) {
        console.log("❌ Mail Send Failed Error Details:", mailError);
      }
    }

    admission.status = status;
    admission.offerCode = currentOfferCode;
    await admission.save();

    res.status(200).send({
      success: true,
      message:
        status === "Accepted"
          ? "Approved and Email process completed!"
          : `Status updated to ${status}`,
      data: admission,
    });
  } catch (error) {
    console.log("Status Update Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating status",
      error,
    });
  }
};

// ==========================================
// 2. Verify Offer Code API (NEW)
// ==========================================
export const verifyOfferCode = async (req, res) => {
  try {
    const { refNumber, offerCode } = req.body;

    if (!refNumber || !offerCode) {
      return res.status(400).send({
        success: false,
        message: "Please provide both Reference Number and Offer Code.",
      });
    }

    const admission = await Admission.findOne({
      applicationId: refNumber.trim(),
      offerCode: offerCode.trim(),
    });

    if (!admission) {
      return res.status(400).send({
        success: false,
        message: "Invalid Reference Number or Offer Code!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Security verification successful!",
      admission,
    });
  } catch (error) {
    console.log("Verification Error:", error);
    res.status(500).send({
      success: false,
      message: "Server error during verification.",
      error,
    });
  }
};

// ==========================================
// Get All Final Submitted Applications (For Admin)
// ==========================================
export const getFinalApplications = async (req, res) => {
  try {
    const applications = await Admission.find({
      $and: [
        { status: { $ne: "Pending" } },
        { fatherNidFile: { $exists: true, $ne: "" } },
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).send({
      success: true,
      message: "Final applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.log("Error fetching final applications:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching final applications",
      error,
    });
  }
};

// ==========================================
// Final Decision: Admit or Reject Student
// ==========================================
// ==========================================
// Final Decision: Admit or Reject Student
// ==========================================
export const updateFinalAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., "Admitted", "Rejected"

    const application = await Admission.findByIdAndUpdate(
      id,
      { status: status },
      { new: true },
    );

    if (!application) {
      return res
        .status(404)
        .send({ success: false, message: "Application not found" });
    }

    const studentName =
      application.studentName ||
      application.childInfo?.fullName ||
      "your child";

   
// ==========================================
    // 🔴 1. In-App Notification Create & Save
    // ==========================================
    try {
      const newNotification = new Notification({
        userId: application.user, // 🔴 'user' এর বদলে 'userId' হবে
        forAdmin: false,
        title: status === "Admitted" ? "Final Admission Confirmed 🎉" : "Admission Update",
        message: status === "Admitted"
          ? `Congratulations! The final admission for ${studentName} has been successfully completed and confirmed.`
          : `We regret to inform you that the final admission application for ${studentName} has been rejected.`,
        isRead: false,
        link: "/dashboard/user" // 🔴 লিংকেও ক্লিক করার জন্য পাথ যোগ করা হলো
      });
      await newNotification.save();
      console.log("✅ In-app Notification saved to database");
    } catch (notifError) {
      console.log("❌ Error saving notification:", notifError);
    }

    // ==========================================
    // 🔴 2. Email Sending Logic
    // ==========================================
    if (status === "Admitted") {
      const targetEmail = application.email || application.familyInfo?.email;

      if (targetEmail) {
        console.log(
          "📨 Attempting to send final admission email to:",
          targetEmail,
        );

        const targetClass =
          application.applyingClass ||
          application.childInfo?.classSought ||
          "the academy";

        const mailOptions = {
          from: `"Madrasatuz Zaytuna International" <${process.env.SMTP_EMAIL}>`,
          to: targetEmail,
          subject:
            "🎉 Final Admission Confirmed - Madrasatuz Zaytuna International",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #059669; margin: 0;">Madrasatuz Zaytuna International</h2>
              </div>
              <h3 style="color: #1e293b; text-align: center;">Congratulations, ${studentName}!</h3>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We are delighted to inform you that your final admission process has been completed successfully. 
                You are now officially admitted to <strong>${targetClass}</strong> for the upcoming session.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Please log in to your student dashboard for further instructions, class schedules, and payment details.
              </p>
              <br/>
              <p style="color: #64748b; font-size: 14px;">
                Warm regards,<br/>
                <strong style="color: #0f172a;">Admission Office</strong>
              </p>
            </div>
          `,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log(
            "✅ Final Admission Email sent successfully:",
            info.response,
          );
        } catch (mailError) {
          console.log("❌ Final Admission Mail Send Failed:", mailError);
        }
      } else {
        console.log("⚠️ No email found to send the admission confirmation.");
      }
    }

    res.status(200).send({
      success: true,
      message: `Student successfully ${status}!`,
      application,
    });
  } catch (error) {
    console.log("Final Status Update Error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating final status",
      error,
    });
  }
};
