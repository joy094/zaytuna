import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    link: { type: String },
    photo: { type: String, required: true }, // এখানে শুধু ফোল্ডারের ছবির লিংক সেভ থাকবে
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);