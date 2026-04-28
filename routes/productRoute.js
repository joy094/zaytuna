//productRoute.js

import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  createOrderController,
  productCategoryController,
  searchProductController,
  extraPhotoController,
  // নতুন কন্ট্রোলার ইমপোর্ট
} from "../controller/productController.js";

const router = express.Router();

// ------------------- PRODUCT ROUTES -------------------

// Create Product (Admin Only)
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  createProductController,
);

// Get All Products (Public)
router.get("/get-product", getProductController);

// Get Single Product (Public)
router.get("/get-product/:slug", getSingleProductController);

// Get Product Photo (Public)
router.get("/product-photo/:pid", productPhotoController);

// Update Product (Admin Only)
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable({ multiples: true }),
  updateProductController,
);

// Delete Product (Admin Only)
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController,
);

// ------------------- ORDER ROUTES -------------------

//user & guest user order route

router.post("/place-order", createOrderController);

// productCategoryController ইম্পোর্ট নিশ্চিত করুন
router.get("/product-category/:slug", productCategoryController);
router.get("/search/:keyword", searchProductController); // সার্চ রাউট
// Get Extra Photos
router.get("/extra-photo/:pid/:index", extraPhotoController);

export default router;
