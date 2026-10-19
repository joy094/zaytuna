import express from "express";
import { 
  createNoticeController, 
  getNoticesController, 
  deleteNoticeController, 
  updateNoticeController 
} from "../controller/noticeController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// নোটিশ তৈরি করার রাউট
router.post("/create", requireSignIn, isAdmin, createNoticeController);

// নোটিশ দেখার রাউট
router.get("/get-notices", getNoticesController);

// নোটিশ ডিলিট করার রাউট
router.delete("/delete/:id", requireSignIn, isAdmin, deleteNoticeController);

// নোটিশ আপডেট (স্ট্যাটাস/এডিট) করার রাউট
router.put("/update-status/:id", requireSignIn, isAdmin, updateNoticeController);

export default router;