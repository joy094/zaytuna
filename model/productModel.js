//productModel.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, lowercase: true },
    brand: { type: String }, // যেমন: Xiaomi, Samsung, Apple
    category: { type: mongoose.ObjectId, ref: "Category", required: true },

    // ছোট হাইলাইটস (ছবির ডান পাশে দেখানোর জন্য)
    // যেমন: ["Brand New (Unofficial)", "10 Days Replacement Warranty"]
    highlights: [String],

    description: { type: String, required: true }, // রিচ টেক্সট (সাধারণ বর্ণনার জন্য)

    // বেস প্রাইস এবং টোটাল স্টক
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 }, // ডিসকাউন্ট থাকলে দেখাবে
    quantity: { type: Number, required: true },

    photo: { data: Buffer, contentType: String },
    extraPhotos: [{ data: Buffer, contentType: String }],

    // === ১. ডাইনামিক ভেরিয়েন্ট (Advanced) ===
    variants: [
      {
        color: String, // Black, Silver
        ram: String, // 6GB, 8GB
        storage: String, // 128GB, 256GB
        region: String, // Global, IND, China, USA
        simType: String, // Physical SIM, e-SIM, Dual SIM
        condition: String, // Official, Unofficial, Refurbished
        price: Number, // এই নির্দিষ্ট ভেরিয়েন্টের দাম
        stock: Number, // এই নির্দিষ্ট ভেরিয়েন্টের স্টক
      },
    ],

    // === ২. ডাইনামিক স্পেসিফিকেশন (টেবিলের জন্য) ===
    // এটি আগে Object ছিল, এখন Array করা হলো যাতে আপনি যত খুশি স্পেক্স যোগ করতে পারেন
    specifications: [
      {
        category: String, // যেমন: "Network", "Display", "Platform"
        name: String, // যেমন: "Technology", "Size", "OS"
        value: String, // যেমন: "GSM / 5G", "6.7 inches", "Android 14"
      },
    ],

    shipping: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of Stock"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
