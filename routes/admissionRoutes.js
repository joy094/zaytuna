// routes/admissionRoutes.js

import express from "express";
import Admission from "../model/admissionModel.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
// 🔴 Socket.io এবং Notification মডেল ইমপোর্ট করা হলো
import { io } from "../index.js";
import Notification from "../model/Notification.js";

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

// 1. Submit Application (Updated with Unique ID & Admin Notification)
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

// 3. Update Application Status (For Admin - Updated with User Notification)
router.put("/update-status/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    // 🔴 ইউজারের জন্য নোটিফিকেশন সেভ করা
    const userNotif = new Notification({
      userId: application.user, // আবেদনকারীর আইডি
      forAdmin: false,
      title: "Application Status Updated",
      message: `Your application status for ${application.childInfo?.fullName} is now: ${status}.`,
      link: "/dashboard/user",
    });
    await userNotif.save();

    // 🔴 রিয়েল-টাইমে নির্দিষ্ট ইউজারের রুমে নোটিফিকেশন পাঠানো
    io.to(application.user.toString()).emit("receive_notification", userNotif);

    res.status(200).send({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error updating status", error });
  }
});

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

import user_model from "../model/user_model.js"; // ইউজার রোল চেক করার জন্য ইমপোর্ট করুন

// Get Notifications for Header
router.get("/notifications", requireSignIn, async (req, res) => {
  try {
    const user = await user_model.findById(req.user._id);
    const isAdmin = user.role === 1;

    // অ্যাডমিন হলে forAdmin: true খুঁজবে, ইউজার হলে নিজের আইডি খুঁজবে
    const query = isAdmin ? { forAdmin: true } : { userId: req.user._id };

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
    const isAdmin = user.role === 1;
    const query = isAdmin ? { forAdmin: true } : { userId: req.user._id };

    // সব আনরিড নোটিফিকেশনকে রিড করে দেওয়া
    await Notification.updateMany(
      { ...query, isRead: false },
      { isRead: true },
    );

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

export default router;
