// models/noticeModel.js
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true }, // এটি স্বয়ংক্রিয়ভাবে createdAt এবং updatedAt সেভ করবে
);

export default mongoose.model("Notice", noticeSchema);
