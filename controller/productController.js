//productController.js

import slugify from "slugify";
import productModel from "../model/productModel.js";
import categoryModel from "../model/categoryModel.js"; // নিশ্চিত করুন এই ইম্পোর্টটি উপরে আছে
import orderModel from "../model/orderModel.js";
import fs from "fs";
import JWT from "jsonwebtoken";
import Fuse from "fuse.js"; // ফিউজ লাইব্রেরি ইম্পোর্ট

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      brand,
      discountPrice,
      highlights,
      variants,
      specifications,
    } = req.fields;
    const { photo, extraPhotos } = req.files;

    // ১. ভ্যালিডেশন
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "Required fields are missing" });
    }

    const products = new productModel({
      ...req.fields,
      slug: slugify(name, { lower: true, strict: false }),
    });

    // ২. ডাইনামিক ডাটা প্রসেসিং (JSON String থেকে Object/Array তে রূপান্তর)
    if (highlights) products.highlights = JSON.parse(highlights);
    if (variants) products.variants = JSON.parse(variants);
    if (specifications) products.specifications = JSON.parse(specifications);

    // ৩. মেইন ফটো হ্যান্ডেলিং
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    // ৪. মাল্টিপল এক্সট্রা ফটো হ্যান্ডেলিং
    if (extraPhotos) {
      const photosArray = Array.isArray(extraPhotos)
        ? extraPhotos
        : [extraPhotos];

      console.log("রিসিভ করা ছবির সংখ্যা:", photosArray.length);

      const extraPhotosData = photosArray.map((p) => ({
        data: fs.readFileSync(p.path),
        contentType: p.type,
      }));
      products.extraPhotos = extraPhotosData;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creation",
      error: error.message,
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

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      variants,
      specifications,
    } = req.fields;
    const { photo } = req.files;

    if (!name) return res.status(400).send({ error: "Name is required" });

    let slug = slugify(name, { lower: true, strict: false });
    if (!slug || slug === "") {
      slug = name.trim().replace(/\s+/g, "-").toLowerCase();
    }

    // ডাটা আপডেট অবজেক্ট তৈরি
    const updateData = { ...req.fields, slug };

    // স্ট্রিং ডাটাকে অবজেক্টে রূপান্তর
    if (variants) updateData.variants = JSON.parse(variants);
    if (specifications) updateData.specifications = JSON.parse(specifications);

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      updateData,
      { new: true },
    );

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

// --- ৮. ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফিল্টার (Product by Category) ---
export const productCategoryController = async (req, res) => {
  try {
    // ১. ইউআরএল থেকে আসা স্লাগ দিয়ে ক্যাটাগরি খুঁজে বের করা
    const category = await categoryModel.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }

    // ২. ওই ক্যাটাগরির আইডি ব্যবহার করে প্রোডাক্টগুলো খুঁজে বের করা
    const products = await productModel
      .find({ category: category._id })
      .populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.error("Category Product Error:", error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error while getting products by category",
    });
  }
};

// --- ৯. প্রোডাক্ট সার্চ কন্ট্রোলার (Search) ---
// Product Search Controller
// export const searchProductController = async (req, res) => {
//   try {
//     const { keyword } = req.params;
//     const results = await productModel
//       .find({
//         $or: [
//           { name: { $regex: keyword, $options: "i" } },
//           { description: { $regex: keyword, $options: "i" } },
//         ],
//       })
//       .select("-photo");

//     // ফ্রন্টএন্ডে সহজে ধরার জন্য এই ফরম্যাটে পাঠান
//     res.status(200).send({
//       success: true,
//       products: results,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       message: "Error In Search Product API",
//       error,
//     });
//   }
// };

//feuze ব্যবহার করে উন্নত সার্চ কন্ট্রোলার

// বাংলার বানান বৈচিত্র্য হ্যান্ডেল করার জন্য (Normalize)
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[শষ]/g, "স")
    .replace(/[ঈী]/g, "ি")
    .replace(/[ঊূ]/g, "ু")
    .replace(/[ড়ঢ়]/g, "র")
    .trim();
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    // ১. ডাটাবেজ থেকে পণ্য নিয়ে আসা
    const products = await productModel.find({}).populate("category");

    // ২. সার্চের জন্য ডাটা প্রস্তুত করা (অরিজিনাল ডাটার সাথে নরমাল টেক্সট ম্যাপ করা)
    const processedData = products.map((p) => ({
      ...p._doc,
      // ডাটাবেজের নামকেও নরমাল করে সার্চের জন্য আলাদা ফিল্ডে রাখা
      searchName: normalizeText(p.name),
      searchCategory: normalizeText(p.category?.name || ""),
    }));

    // ৩. Fuse.js কনফিগারেশন
    const fuseOptions = {
      keys: [
        { name: "name", weight: 0.7 }, // আসল নাম (বেশি গুরুত্ব)
        { name: "searchName", weight: 0.5 }, // নরমাল করা নাম (বানান ভুলের জন্য)
        { name: "category.name", weight: 0.3 },
        { name: "searchCategory", weight: 0.2 },
        "description",
      ],
      threshold: 0.4,
      distance: 100,
      ignoreLocation: true,
      minMatchCharLength: 2,
    };

    const fuse = new Fuse(processedData, fuseOptions);

    // ৪. কি-ওয়ার্ডকেও নরমাল করে সার্চ করা
    const results = fuse.search(normalizeText(keyword));

    // ৫. রেজাল্ট ফিল্টার করা
    const finalProducts = results.map((result) => result.item);

    res.status(200).send({
      success: true,
      products: finalProducts.slice(0, 10),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Search API",
      error,
    });
  }
};

// ব্যাকএন্ড কন্ট্রোলার উদাহরণ
// এক্সট্রা ফটো কন্ট্রোলার
export const extraPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.pid)
      .select("extraPhotos");

    // ইউআরএল থেকে আসা ইন্ডেক্সটিকে নাম্বারে রূপান্তর করা হলো
    const index = parseInt(req.params.index, 10);

    if (product?.extraPhotos && product.extraPhotos[index]?.data) {
      res.set("Content-Type", product.extraPhotos[index].contentType);
      return res.status(200).send(product.extraPhotos[index].data);
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Photo not found" });
    }
  } catch (error) {
    console.error("Extra Photo Error:", error);
    res
      .status(500)
      .send({ success: false, message: "Error in loading extra photo" });
  }
};
