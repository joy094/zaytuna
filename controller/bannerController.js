//bannerController.js

import bannerModel from "../model/bannerModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ================= Multer Setup (ফোল্ডারে ছবি সেভ করার ম্যাজিক) =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public/uploads/banners";
    // যদি ফোল্ডার না থাকে, তবে অটোমেটিক তৈরি করে নেবে
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // ছবির নামের শেষে সময় যুক্ত করে ইউনিক নাম তৈরি করা হলো
    cb(null, "banner-" + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

// ================= 1. Create Banner (ছবি আপলোড) =================
export const createBannerController = async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "Photo is required" });
    }

    // ফ্রন্টএন্ডে দেখানোর জন্য ছবির স্ট্যাটিক লিংক তৈরি
    const photoUrl = `/uploads/banners/${req.file.filename}`;

    const banner = new bannerModel({
      title,
      subtitle,
      link,
      photo: photoUrl,
    });

    await banner.save();
    res
      .status(201)
      .send({ success: true, message: "Banner created successfully", banner });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in creating banner", error });
  }
};

// ================= 2. Get All Banners (সব ব্যানার দেখানো) =================
export const getBannersController = async (req, res) => {
  try {
    const banners = await bannerModel.find({}).sort({ createdAt: -1 }); // নতুন ছবি আগে দেখাবে
    res.status(200).send({ success: true, banners });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in getting banners", error });
  }
};

// ================= 3. Delete Banner (ব্যানার ডিলিট করা) =================
export const deleteBannerController = async (req, res) => {
  try {
    const banner = await bannerModel.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .send({ success: false, message: "Banner not found" });
    }

    // ফোল্ডার থেকে আসল ছবিটি ডিলিট করা
    const filePath = `./public${banner.photo}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ডাটাবেজ থেকে ডাটা মুছে ফেলা
    await bannerModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in deleting banner", error });
  }
};
