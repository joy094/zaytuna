import Category from "../model/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    //save category in db
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.error("Error in createCategoryController:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in creating category",
      error: error.message,
    });
  }
};

//update category controller
export const updateCreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error in updateCreateCategoryController:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error: error.message,
    });
  }
};
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
