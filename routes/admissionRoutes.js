import express from "express";
import Admission from "../model/admissionModel.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js"; // আপনার অ্যাডমিন মিডলওয়্যার

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


// 1. Submit Application (Updated with Unique ID)
router.post('/submit-application', requireSignIn, async (req, res) => {
  try {
    // 🔴 ইউনিক অ্যাপ্লিকেশন আইডি জেনারেট করা (যেমন: ZI-27-0001)
    const totalApplications = await Admission.countDocuments();
    const newAppId = `ZI-27-${(totalApplications + 1).toString().padStart(4, '0')}`;

    const calculatedScore = calculateScreeningScore(req.body); // আগের স্কোরিং লজিক
    
    const newApplication = new Admission({
      user: req.user._id,
      applicationId: newAppId, // 🔴 আইডি ডাটাবেজে সেভ করা হচ্ছে
      score: calculatedScore,
      ...req.body
    });
    
    await newApplication.save();
    res.status(201).send({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.log("Submit Error:", error);
    res.status(500).send({ success: false, message: 'Error submitting application', error });
  }
});

// 2. Get All Applications (For Admin)
router.get("/all-applications", requireSignIn, isAdmin, async (req, res) => {
  try {
    // 🔴 populate সাময়িকভাবে বাদ দেওয়া হলো এরর চেক করার জন্য
    const applications = await Admission.find().sort({ createdAt: -1 });
    res.status(200).send({ success: true, applications });
  } catch (error) {
    console.log("Route Error:", error);
    res
      .status(500)
      .send({ success: false, message: "Error fetching applications", error });
  }
});

// 3. Update Application Status (For Admin)
router.put("/update-status/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
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

// Get Logged-in User's Application
// Get Logged-in User's Applications (একাধিক অ্যাপ্লিকেশনের জন্য)
router.get('/my-applications', requireSignIn, async (req, res) => {
  try {
    // findOne এর বদলে find ব্যবহার করা হয়েছে এবং sort করে নতুনগুলো আগে দেওয়া হয়েছে
    const applications = await Admission.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).send({ success: true, applications });
  } catch (error) {
    console.log("Error in my-applications route:", error);
    res.status(500).send({ success: false, message: 'Error fetching applications', error });
  }
});

export default router;
