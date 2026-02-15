// --- প্রোডাক্ট কন্ট্রোলার (Product Controller) ---

import slugify from "slugify";
import productModel from "../model/productModel.js";
import orderModel from "../model/orderModel.js";
import fs from "fs";
import JWT from "jsonwebtoken";
// --- ১. প্রোডাক্ট তৈরি (Create Product) ---
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // ১. ভ্যালিডেশন চেক (এরর হ্যান্ডলিং)
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All text fields are required" });
    }
    if (!photo || photo.size > 1000000) {
      return res
        .status(400)
        .send({ error: "Photo is required and should be less than 1MB" });
    }

    // ২. নতুন প্রোডাক্ট অবজেক্ট তৈরি
    const products = new productModel({ ...req.fields, slug: slugify(name) });

    // ৩. ফটো বাইনারি ডাটা হিসেবে সেভ করা
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error); // এটি আপনার টার্মিনালে আসল এরর দেখাবে
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in creating product",
    });
  }
};
// --- ২. সব প্রোডাক্ট দেখা (Get All) ---
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: products.length,
      message: "All products fetched",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// --- ৩. নির্দিষ্ট প্রোডাক্ট (Single Product) ---
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching single product",
    });
  }
};

// --- ৪. প্রোডাক্ট ফটো লোড (Photo) ---
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error loading photo" });
  }
};

// --- ৫. প্রোডাক্ট আপডেট (Update) ---
export const updateProductController = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.fields;
    const { photo } = req.files;

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true },
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating product" });
  }
};

// --- ৬. প্রোডাক্ট ডিলিট (Delete) ---
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error deleting product" });
  }
};

// --- ৭. // --- স্মার্ট অর্ডার কন্ট্রোলার (User & Guest Both) ---
export const createOrderController = async (req, res) => {
  try {
    const { cart, customerDetails } = req.body;
    let userId = null;

    // টোকেন চেক করা (যদি ইউজার লগইন থাকে)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const decode = JWT.verify(authHeader, process.env.JWT_SECRET);
        userId = decode._id;
      } catch (err) {
        console.log("Token verification failed, treating as guest");
      }
    }

    const order = new orderModel({
      products: cart,
      payment: { method: "COD", status: "Pending" },
      paymentMethod: "COD",
      buyer: userId, // আইডি থাকলে ইউজার অর্ডার, না থাকলে গেস্ট
      guestDetails: userId ? null : customerDetails, // ইউজার হলে গেস্ট ডিটেইলস দরকার নেই
      status: "Not Process",
    });

    await order.save();
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error", error });
  }
};
