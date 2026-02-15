// orderModel.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
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
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true },
);

// এটি মূল সমাধান: যদি মডেলটি থাকে তবে সেটি ব্যবহার করবে, নাহলে নতুন বানাবে
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
