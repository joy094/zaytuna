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

    // ভ্যালিডেশন
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All text fields are required" });
    }

    // ইউনিকোড নিরাপদ স্লাগ জেনারেশন
    let slug = slugify(name, { lower: true, strict: false });
    if (!slug) {
      slug = name.trim().replace(/\s+/g, "-").toLowerCase();
    }

    const products = new productModel({ ...req.fields, slug });

    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).send({ error: "Photo should be less than 1MB" });
      }
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
    console.error("SERVER ERROR:", error);
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

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product Not Found" });
    }

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

// --- ৫. প্রোডাক্ট আপডেট (Update - Admin Action) ---
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // ১. ভ্যালিডেশন (ঐচ্ছিক কিন্তু নিরাপদ)
    if (!name) return res.status(400).send({ error: "Name is required" });

    // ২. বাংলা ইউনিকোড নিরাপদ স্লাগ জেনারেশন (আপডেটের জন্য)
    let slug = slugify(name, { lower: true, strict: false });

    // যদি স্লাগিফাই বাংলা সাপোর্ট না করে খালি স্ট্রিং দেয়, তবে ম্যানুয়ালি হ্যান্ডেল করা
    if (!slug || slug === "") {
      slug = name.trim().replace(/\s+/g, "-").toLowerCase();
    }

    // ৩. প্রোডাক্ট আপডেট করা
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slug }, // এখানে নিশ্চিতভাবে নতুন স্লাগ পাঠানো হচ্ছে
      { new: true },
    );

    // ৪. ফটো আপডেট লজিক
    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).send({ error: "Photo should be less than 1MB" });
      }
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while updating product",
    });
  }
};

// --- ৬. প্রোডাক্ট ডিলিট (Delete - Admin Action) ---
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error deleting product" });
  }
};

// --- ৭. স্মার্ট অর্ডার কন্ট্রোলার ---
export const createOrderController = async (req, res) => {
  try {
    const { cart, customerDetails } = req.body;
    let userId = null;

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
      buyer: userId,
      guestDetails: userId ? null : customerDetails,
      status: "Not Process",
    });

    await order.save();
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error placing order", error });
  }
};
