import express from "express";
const router = express.Router();
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  singleCategoryController,
  updateCreateCategoryController,
} from "../controller/categoryControler.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { get } from "mongoose";
//routes
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCreateCategoryController
);
//get all category

router.get("/get-category", getCategoryController);

//get single category by slug

router.get("/single-category/:slug", singleCategoryController);


//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin,deleteCategoryController);

export default router;
