// routes/admissionRoutes.js

import express from "express";
import Admission from "../model/admissionModel.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
// import { updateAdmissionStatus } from "../controller/admissionStatusController.js";
// 🔴 Socket.io এবং Notification মডেল ইমপোর্ট করা হলো
import { io } from "../index.js";
import Notification from "../model/Notification.js";
import user_model from "../model/user_model.js"; // ইউজার রোল চেক করার জন্য ইমপোর্ট
import {
  updateAdmissionStatus,
  verifyOfferCode,
} from "../controller/admissionStatusController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getFinalApplications,
  updateFinalAdmissionStatus,
} from "../controller/admissionStatusController.js";

const router = express.Router();

// অটোমেটিক স্কোর ক্যালকুলেট করার হেল্পার ফাংশন
const calculateScreeningScore = (data) => {
  let score = 0;
  // Deen Info (Max 30)
  if (data.deenInfo?.fatherPrayer?.includes("All five")) score += 10;
  if (data.deenInfo?.motherPrayer?.includes("All five")) score += 10;
  if (data.deenInfo?.quranRecitation === "Daily") score += 10;

  // Home Info (Max 30)
  if (data.homeInfo?.ribaOrProhibited === "No") score += 15;
  if (
    data.homeInfo?.television === "No" ||
    data.homeInfo?.television === "Yes, rarely used and supervised"
  )
    score += 10;
  if (data.homeInfo?.music === "No") score += 5;

  // Habits & Conduct (Max 25)
  if (
    data.habitsInfo?.screenTime === "None" ||
    data.habitsInfo?.screenTime === "Under 30 minutes"
  )
    score += 10;
  if (data.habitsInfo?.conduct?.showsInterestInDeen === "Often") score += 10;
  if (data.habitsInfo?.conduct?.badWords === "Rarely") score += 5;

  // Commitment (Max 15)
  if (data.commitmentInfo?.parentGoOverQuran === "Yes, daily") score += 10;
  if (
    data.commitmentInfo?.mainHope?.includes("practising Muslim") ||
    data.commitmentInfo?.mainHope?.includes("Islamic knowledge")
  )
    score += 5;

  return score; // Total out of 100
};

// 1. Submit Application
router.post("/submit-application", requireSignIn, async (req, res) => {
  try {
    const totalApplications = await Admission.countDocuments();
    const newAppId = `ZI-27-${(totalApplications + 1).toString().padStart(4, "0")}`;

    const calculatedScore = calculateScreeningScore(req.body);

    const newApplication = new Admission({
      user: req.user._id,
      applicationId: newAppId,
      score: calculatedScore,
      ...req.body,
    });

    await newApplication.save();

    // 🔴 অ্যাডমিনের জন্য নোটিফিকেশন সেভ করা
    const adminNotif = new Notification({
      forAdmin: true,
      title: "New Admission Application",
      message: `A new application (REF: ${newAppId}) has been submitted by ${req.body.childInfo.fullName}.`,
      link: "/dashboard/admin/manage-applications",
    });
    await adminNotif.save();

    // 🔴 রিয়েল-টাইমে অ্যাডমিন রুমে নোটিফিকেশন পাঠানো
    io.to("admin_room").emit("receive_notification", adminNotif);

    res
      .status(201)
      .send({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.log("Submit Error:", error);
    res
      .status(500)
      .send({ success: false, message: "Error submitting application", error });
  }
});

// 2. Get All Applications (For Admin)
router.get("/all-applications", requireSignIn, isAdmin, async (req, res) => {
  try {
    const applications = await Admission.find().sort({ createdAt: -1 });
    res.status(200).send({ success: true, applications });
  } catch (error) {
    console.log("Route Error:", error);
    res
      .status(500)
      .send({ success: false, message: "Error fetching applications", error });
  }
});

// 3. Update Application Status & Send Email (Using controller with Nodemailer & Socket.io)
router.put("/update-status/:id", requireSignIn, isAdmin, updateAdmissionStatus);

// Get Logged-in User's Applications
router.get("/my-applications", requireSignIn, async (req, res) => {
  try {
    const applications = await Admission.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).send({ success: true, applications });
  } catch (error) {
    console.log("Error in my-applications route:", error);
    res
      .status(500)
      .send({ success: false, message: "Error fetching applications", error });
  }
});

// Get Notifications for Header
router.get("/notifications", requireSignIn, async (req, res) => {
  try {
    const user = await user_model.findById(req.user._id);
    const isAdminUser = user.role === 1;

    const query = isAdminUser ? { forAdmin: true } : { userId: req.user._id };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    res.status(200).send({ success: true, notifications, unreadCount });
  } catch (error) {
    console.log("Notif Error:", error);
    res
      .status(500)
      .send({ success: false, message: "Error fetching notifications" });
  }
});

// Mark Notifications as Read
router.put("/notifications/mark-read", requireSignIn, async (req, res) => {
  try {
    const user = await user_model.findById(req.user._id);
    const isAdminUser = user.role === 1;
    const query = isAdminUser ? { forAdmin: true } : { userId: req.user._id };

    await Notification.updateMany(
      { ...query, isRead: false },
      { isRead: true },
    );

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

//verify Otp Route

router.post("/verify-offer-code", verifyOfferCode);

// যেহেতু ৩টি আলাদা ফাইল আসবে, তাই upload.fields() ব্যবহার করতে হবে
const admissionFilesUpload = upload.fields([
  { name: "fatherNidFile", maxCount: 1 },
  { name: "birthCertFile", maxCount: 1 },
  { name: "photoFile", maxCount: 1 },
]);

// 🔴 Final Admission Form Submit API (Updated with Find One & Update)
router.post(
  "/final-submit",
  requireSignIn,
  admissionFilesUpload,
  async (req, res) => {
    try {
      console.log("🔥 HIT FINAL SUBMIT ROUTE!");
      const {
        refNumber,
        studentName,
        dob,
        applyingClass,
        session,
        fatherNid,
        motherNid,
        fatherMobile,
        motherMobile,
        email,
        emergencyName,
        emergencyMobile,
        siblingName,
        siblingClass,
        guardianName,
        guardianSignature,
      } = req.body;

      // ফাইলগুলোর পাথ রিসিভ করা
      const fatherNidPath = req.files["fatherNidFile"]
        ? req.files["fatherNidFile"][0].path
        : "";
      const birthCertPath = req.files["birthCertFile"]
        ? req.files["birthCertFile"][0].path
        : "";
      const photoPath = req.files["photoFile"]
        ? req.files["photoFile"][0].path
        : "";

      // 🔴 রেফারেন্স নাম্বার (applicationId) দিয়ে প্রি-এডমিশনের ডকুমেন্টটি খুঁজে বের করে আপডেট করা
      const updatedAdmission = await Admission.findOneAndUpdate(
        { applicationId: refNumber.trim() },
        {
          studentName,
          dob,
          applyingClass,
          session,
          fatherNid,
          motherNid,
          fatherMobile,
          motherMobile,
          email,
          emergencyName,
          emergencyMobile,
          siblingName,
          siblingClass,
          guardianName,
          guardianSignature,
          fatherNidFile: fatherNidPath,
          birthCertFile: birthCertPath,
          photoFile: photoPath,
          status: "Under Review", // অথবা ফাইনাল সাবমিটেড স্ট্যাটাস
        },
        { new: true },
      );

      if (!updatedAdmission) {
        return res
          .status(404)
          .send({
            success: false,
            message: "Application not found with this Reference Number!",
          });
      }

      console.log(
        "✅ Final admission data updated successfully for:",
        refNumber,
      );

      res
        .status(200)
        .send({
          success: true,
          message: "Final Application submitted successfully!",
        });
    } catch (error) {
      console.log("Final Submit Error:", error);
      res
        .status(500)
        .send({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  },
);

router.get("/final-applications", requireSignIn, isAdmin, getFinalApplications);

// 2. Finalize Admission Status Route (Admin Only)
router.put(
  "/finalize-status/:id",
  requireSignIn,
  isAdmin,
  updateFinalAdmissionStatus,
);

export default router;
