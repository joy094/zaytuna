import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      // আগে description ছিল, ফ্রন্টএন্ডের সাথে মিলিয়ে content বা description রাখতে পারেন
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["academic", "official", "career"], // ফ্রন্টএন্ডের ট্যাব ফিল্টারের জন্য জরুরি
      lowercase: true,
    },
    tag: {
      type: String,
      required: true, // যেমন: "Academic Notice", "Official Notice", "Career"
    },
    date: {
      type: String,
      required: true, // যেমন: "October 19, 2026" (অথবা চাইলে type: Date রাখতে পারেন)
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notice", noticeSchema);
