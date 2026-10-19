//user_model.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // বানান ঠিক করা হয়েছে
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ইমেইল সবসময় ছোট হাতের অক্ষরে সেভ হবে
    },
    password: {
      type: String,
      required: false, // বানান ঠিক করা হয়েছে
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    answer: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      default: 0, // 0 = User, 1 = Admin
    },
  },
  { timestamps: true },
);

// মডেলের নাম "users" রাখলে কন্ট্রোলারে সুবিধা হয়, তবে আপনার USER_LIST ও ঠিক আছে।
const DB_model = mongoose.model("user", UserSchema);
export default DB_model;
