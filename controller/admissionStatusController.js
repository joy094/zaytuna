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
// 1. Update Status & Send Emails/Notifications API
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

    // যদি স্ট্যাটাস পরিবর্তন না হয়, তবে কিছু করার দরকার নেই
    if (admission.status === status) {
      return res.status(200).send({
        success: true,
        message: `Status is already ${status}`,
        data: admission,
      });
    }

    let currentOfferCode = admission.offerCode;
    const recipientEmail = admission.familyInfo?.email;
    const studentName = admission.childInfo?.fullName || "your child";

    // ==========================================
    // 🔴 1. In-App Notification (For ALL statuses)
    // ==========================================
    try {
      const newNotification = new Notification({
        userId: admission.user,
        forAdmin: false,
        title: "Application Status Updated",
        message: `The admission status for ${studentName} (ID: ${admission.applicationId}) is now: ${status}.`,
        isRead: false,
        link: "/dashboard/user",
      });
      await newNotification.save();
      console.log(`✅ In-app Notification saved for status: ${status}`);
    } catch (notifError) {
      console.log("❌ Error saving notification:", notifError);
    }

    // ==========================================
    // 🔴 2. Background Email Sending Logic (No Await)
    // ==========================================
    if (status === "Accepted") {
      // 🟢 'Accepted' হলে অফার কোড সহ মেইল
      currentOfferCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (recipientEmail) {
        const mailOptions = {
          from: `"Madrasatuz Zaytuna International" <${process.env.SMTP_EMAIL}>`,
          to: recipientEmail,
          subject: "Application Approved - Final Admission Offer Code",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">Congratulations!</h2>
              <p style="color: #334155; font-size: 16px;">Dear Parent,</p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We are delighted to inform you that the pre-admission application for <strong>${studentName}</strong> (ID: ${admission.applicationId}) has been <strong>Approved</strong>.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                To complete the final admission process, please log in to your dashboard and enter the following highly confidential Offer Code:
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <span style="font-size: 28px; font-weight: bold; background: #ecfdf5; color: #064e3b; padding: 15px 30px; border-radius: 8px; border: 2px dashed #10b981; letter-spacing: 5px;">
                  ${currentOfferCode}
                </span>
              </div>
              <p style="color: #64748b; font-size: 14px;">Warm regards,<br/><strong style="color: #0f172a;">Madrasatuz Zaytuna International</strong></p>
            </div>
          `,
        };
        // 🔴 await রিমুভ করে Promise (.then) ব্যবহার করা হয়েছে
        transporter
          .sendMail(mailOptions)
          .then(() => console.log("✅ Offer Code Email sent in background"))
          .catch((mailError) =>
            console.log("❌ Offer Code Mail Send Failed:", mailError),
          );
      }
    } else {
      // 🟢 অন্য যেকোনো স্ট্যাটাস (Invite to Interview, Hold, Cancelled) এর জন্য নরমাল মেইল
      if (recipientEmail) {
        const mailOptions = {
          from: `"Madrasatuz Zaytuna International" <${process.env.SMTP_EMAIL}>`,
          to: recipientEmail,
          subject: `Application Update: ${status} - Madrasatuz Zaytuna`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">Madrasatuz Zaytuna International</h2>
              <p style="color: #334155; font-size: 16px;">Dear Parent,</p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                This is an update regarding the admission application for <strong>${studentName}</strong> (ID: ${admission.applicationId}). 
                The current status of your application has been updated to: <strong style="color: #0284c7;">${status}</strong>.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                ${status === "Invite to Interview" ? "Please check your dashboard or contact the office for the interview schedule." : "Please log in to your dashboard for further details."}
              </p>
              <br/>
              <p style="color: #64748b; font-size: 14px;">Warm regards,<br/><strong style="color: #0f172a;">Admission Office</strong></p>
            </div>
          `,
        };
        // 🔴 await রিমুভ করে Promise (.then) ব্যবহার করা হয়েছে
        transporter
          .sendMail(mailOptions)
          .then(() =>
            console.log(
              `✅ General Email sent in background for status: ${status}`,
            ),
          )
          .catch((mailError) =>
            console.log("❌ General Mail Send Failed:", mailError),
          );
      }
    }

    // 🔴 ডাটাবেসে স্ট্যাটাস সেভ করে সাথে সাথেই রেসপন্স পাঠিয়ে দেওয়া হলো
    admission.status = status;
    admission.offerCode = currentOfferCode;
    await admission.save();

    res.status(200).send({
      success: true,
      message:
        status === "Accepted"
          ? "Approved and Email process running in background!"
          : `Status updated to ${status}!`,
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
        userId: application.user,
        forAdmin: false,
        title:
          status === "Admitted"
            ? "Final Admission Confirmed 🎉"
            : "Admission Update",
        message:
          status === "Admitted"
            ? `Congratulations! The final admission for ${studentName} (ID: ${application.applicationId}) has been successfully completed and confirmed.`
            : `We regret to inform you that the final admission application for ${studentName} (ID: ${application.applicationId}) has been rejected.`,
        isRead: false,
        link: "/dashboard/user",
      });
      await newNotification.save();
      console.log("✅ In-app Notification saved to database");
    } catch (notifError) {
      console.log("❌ Error saving notification:", notifError);
    }

    // ==========================================
    // 🔴 2. Background Email Sending Logic (No Await)
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
                You are now officially admitted to <strong>${targetClass}</strong> (ID: ${application.applicationId}) for the upcoming session.
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

        // 🔴 await রিমুভ করে Promise (.then) ব্যবহার করা হয়েছে
        transporter
          .sendMail(mailOptions)
          .then(() =>
            console.log(
              "✅ Final Admission Email sent successfully in background",
            ),
          )
          .catch((mailError) =>
            console.log("❌ Final Admission Mail Send Failed:", mailError),
          );
      } else {
        console.log("⚠️ No email found to send the admission confirmation.");
      }
    }

    res.status(200).send({
      success: true,
      message: `Student successfully ${status}! Email process running in background.`,
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
