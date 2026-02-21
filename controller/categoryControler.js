//category controller

import Category from "../model/categoryModel.js";
import slugify from "slugify";


// স্লাগ জেনারেট করার জন্য কাস্টম ফাংশন
const generateSlug = (text) => {
  return text
    .trim()
    .replace(/\s+/g, "-") // স্পেসের বদলে ড্যাশ (-) হবে
    .replace(/[^\u0980-\u09FF\w-]+/g, "") // বাংলা অক্ষর (\u0980-\u09FF) এবং ইংরেজি অক্ষর ছাড়া বাকি সব রিমুভ করবে
    .toLowerCase();
};

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category already exists",
      });
    }

    // নতুন স্লাগ লজিক
    const category = await new Category({
      name,
      slug: generateSlug(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in creating category",
      error: error.message,
    });
  }
};

// Update Category
export const updateCreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: generateSlug(name),
      },
      { new: true },
    );

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error: error.message,
    });
  }
};
// ... বাকি মেথডগুলো (get, single, delete) আগের মতোই থাকবে।
//get all category controller
export const getCategoryController = async (req, res) => {
  try {
    const category = await Category.find({});

    res.status(200).send({
      success: true,
      message: "All categories fetched successfully",
      category,
    });
  } catch (error) {
    console.error("Error in getCategoryController:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in fetching categories",
      error: error.message,
    });
  }
};

//get single category controller
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.error("Error in singleCategoryController:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in fetching category",
      error: error.message,
    });
  }
};

//delete category controller
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCategoryController:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in deleting category",
      error: error.message,
    });
  }
};
