import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createBannerController,
  getBannersController,
  deleteBannerController,
  upload,
} from "../controller/bannerController.js";

const router = express.Router();

// নতুন ব্যানার আপলোড (শুধু এডমিন পারবে) - এখানে upload.single("photo") মাল্টারের কাজ করবে
router.post(
  "/create-banner",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  createBannerController,
);

// সব ব্যানার গেট করা (পাবলিক)
router.get("/get-banners", getBannersController);

// ব্যানার ডিলিট করা (শুধু এডমিন পারবে)
router.delete(
  "/delete-banner/:id",
  requireSignIn,
  isAdmin,
  deleteBannerController,
);

export default router;
