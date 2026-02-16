import React, { useState, useEffect } from "react";
import { Layout } from "../../App";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/category/get-category",
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!photo) return toast.error("Photo is required");

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      // লোকাল স্টোরেজ থেকে টোকেন নেওয়া (অ্যাডমিন ভেরিফিকেশনের জন্য)
      const authData = JSON.parse(localStorage.getItem("auth"));

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData,
        {
          headers: {
            Authorization: authData?.token, // এটি অত্যন্ত জরুরি
          },
        },
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while creating product",
      );
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container dashboard-grid">
        <AdminMenu />
        <div className="content-area">
          <h1 className="page-title">Create New Product</h1>
          <div className="product-form-card">
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="custom-file-upload">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                  {photo
                    ? `Selected: ${photo.name}`
                    : "📁 Click to Upload Photo"}
                </label>
              </div>

              {photo && (
                <div className="image-preview-box">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="preview"
                    className="img-fluid"
                    style={{ maxHeight: "200px", borderRadius: "10px" }}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div
                className="form-row"
                style={{ display: "flex", gap: "10px" }}
              >
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Shipping</label>
                <select
                  className="form-control"
                  onChange={(e) => setShipping(e.target.value)}
                  value={shipping}
                  required
                >
                  <option value="">Select shipping status</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <button type="submit" className="btn-submit">
                CREATE PRODUCT
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
