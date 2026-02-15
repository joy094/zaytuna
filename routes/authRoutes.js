import express from "express";
import {
  loginController,
  registerController,
  testController,
  forgotPasswordController,
  getAllOrdersController, // নতুন কন্ট্রোলার ইমপোর্ট
  updateProfileController,
  updateOrderStatusController,
  getOrdersController,
  getAllUsersController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// Forget password || POST
router.post("/forgot-password", forgotPasswordController);

// Test protected router
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// All orders for Admin
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
// ------------------- PROFILE ROUTE -------------------
// Profile Update || Method PUT

// orders route (ইউজার ড্যাশবোর্ডের জন্য)
router.get("/orders", requireSignIn, getOrdersController);

router.put("/profile", requireSignIn, updateProfileController); // এই রুটটিই আপনার মিসিং ছিল

router.put(
  "/update-order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatusController,
); // অর্ডার স্ট্যাটাস আপডেট করার জন্য নতুন রুট

// Admin এর জন্য সব ইউজার দেখার রুট

router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

export default router;
