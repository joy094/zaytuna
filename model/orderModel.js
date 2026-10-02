// orderModel.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔴 ম্যাজিক ফিক্স: এখানে আগে শুধু ObjectId ছিল, তাই Mongoose ছবি ও ভেরিয়েন্ট ডিলিট করে দিত!
    // এখন 'Mixed' টাইপ দেওয়ার ফলে কার্ট থেকে আসা ছবি, ভেরিয়েন্ট, দাম—সব হুবহু ডাটাবেজে সেভ হবে।
    products: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    payment: {
      method: { type: String, default: "COD" },
      status: { type: String, default: "Pending" },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "user",
      default: null,
    },
    guestDetails: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      note: { type: String },
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
