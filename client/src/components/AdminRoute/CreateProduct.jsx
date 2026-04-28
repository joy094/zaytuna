import React, { useState, useEffect } from "react";
import Layout from "../../components/pages/Layout";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreateProduct.css";

const CreateProduct = () => {
  const navigate = useNavigate();

  // বেসিক ডাটা স্টেট
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("0");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("1");
  const [status, setStatus] = useState("Active");

  // ইমেজ স্টেট
  const [photo, setPhoto] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]);

  // === নতুন: এক্সট্রা ছবি অ্যাড ও রিমুভ করার ফাংশন ===
  const handleExtraPhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setExtraPhotos((prevPhotos) => [...prevPhotos, ...files]);
  };

  const removeExtraPhoto = (indexToRemove) => {
    setExtraPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove),
    );
  };

  // ডাইনামিক ডাটা স্টেট
  const [highlights, setHighlights] = useState([""]);

  const [variants, setVariants] = useState([
    {
      color: "",
      ram: "",
      storage: "",
      region: "",
      simType: "",
      condition: "",
      price: "",
      stock: "",
    },
  ]);

  const BRAND_OPTIONS = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Vivo",
    "Oppo",
    "Realme",
    "OnePlus",
    "Google",
    "Motorola",
    "Infinix",
    "Tecno",
    "Nothing",
  ];

  const COLOR_OPTIONS = [
    "Black",
    "White",
    "Silver",
    "Gray",
    "Space Gray",
    "Titanium",
    "Natural Titanium",
    "Blue",
    "Pacific Blue",
    "Sierra Blue",
    "Midnight",
    "Starlight",
    "Gold",
    "Deep Purple",
    "Red",
    "Green",
    "Yellow",
    "Pink",
  ];
  const RAM_OPTIONS = ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB"];
  const STORAGE_OPTIONS = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
  const REGION_OPTIONS = [
    "Global",
    "Official",
    "USA",
    "HK",
    "China",
    "India",
    "VN",
  ];
  const SIM_OPTIONS = [
    "Single SIM",
    "Dual Physical",
    "e-SIM + Physical",
    "Dual e-SIM",
  ];
  const CONDITION_OPTIONS = [
    "Brand New",
    "Unofficial",
    "Refurbished",
    "Pre-owned",
  ];

  // টেকনিক্যাল স্পেকসের জন্য প্রিসেট
  const SPEC_PRESETS = [
    { category: "Display", name: "Type" },
    { category: "Display", name: "Size" },
    { category: "Display", name: "Resolution" },
    { category: "Platform", name: "OS" },
    { category: "Platform", name: "Chipset" },
    { category: "Main Camera", name: "Triple" },
    { category: "Main Camera", name: "Features" },
    { category: "Selfie Camera", name: "Single" },
    { category: "Battery", name: "Capacity" },
    { category: "Battery", name: "Charging" },
  ];

  const [specifications, setSpecifications] = useState([
    { category: "Network", name: "Technology", value: "" },
  ]);

  // === ক্যাটাগরি আনা ===
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category || data?.categories || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // === ডাইনামিক ফিল্ড হ্যান্ডেলার ===
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };
  const addHighlightRow = () => setHighlights([...highlights, ""]);
  const removeHighlightRow = (index) =>
    setHighlights(highlights.filter((_, i) => i !== index));

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const addVariantRow = () =>
    setVariants([
      ...variants,
      {
        color: "",
        ram: "",
        storage: "",
        region: "",
        simType: "",
        condition: "",
        price: "",
        stock: "",
      },
    ]);
  const removeVariantRow = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };
  const addSpecRow = () =>
    setSpecifications([
      ...specifications,
      { category: "", name: "", value: "" },
    ]);
  const removeSpecRow = (index) =>
    setSpecifications(specifications.filter((_, i) => i !== index));

  // === ফর্ম সাবমিট ===
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!photo) return toast.error("Main Photo is required!");

      const productData = new FormData();
      productData.append("name", name);
      productData.append("brand", brand);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("discountPrice", discountPrice);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("status", status);

      // মেইন ছবি
      productData.append("photo", photo);

      // এক্সট্রা ছবি লুপ করে পাঠানো
      if (extraPhotos && extraPhotos.length > 0) {
        for (let i = 0; i < extraPhotos.length; i++) {
          productData.append("extraPhotos", extraPhotos[i]);
        }
      }

      productData.append(
        "highlights",
        JSON.stringify(highlights.filter((h) => h.trim() !== "")),
      );
      productData.append("variants", JSON.stringify(variants));
      productData.append("specifications", JSON.stringify(specifications));

      const authData = JSON.parse(localStorage.getItem("auth"));
      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productData,
        {
          headers: { Authorization: authData?.token },
        },
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout title={"Create Product - Admin"}>
      <div className="container dashboard-grid">
        <AdminMenu />
        <div className="content-area">
          <h1 className="page-title">Add New Product</h1>
          <form className="product-form-card" onSubmit={handleCreate}>
            {/* === ১. ফটো আপলোড ও প্রিভিউ সেকশন === */}
            <div className="form-row">
              <div className="form-group">
                <label>Main Product Image *</label>
                <label className="custom-file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                    required
                  />
                  {photo
                    ? "✅ Main Photo Selected"
                    : "📸 Click to Upload Main Image"}
                </label>
                {/* মেইন ফটোর প্রিভিউ */}
                {photo && (
                  <div className="mt-2 text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="main preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #ddd",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Extra Gallery Images</label>
                <label
                  className="custom-file-upload"
                  style={{ borderColor: "#28a745" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraPhotoUpload}
                    hidden
                  />
                  ➕ Add More Images
                </label>
                {/* এক্সট্রা ফটোর প্রিভিউ গ্যালারি */}
                {extraPhotos && extraPhotos.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {extraPhotos.map((file, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`extra-${index}`}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraPhoto(index)}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            fontSize: "10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* === ২. বেসিক ইনফো === */}
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select
                  className="form-control"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {BRAND_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  {/* আপনি চাইলে নিচে একটি 'Other' অপশনও রাখতে পারেন */}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Base Price *</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Discount Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Total Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Shipping</label>
                <select
                  className="form-control"
                  onChange={(e) => setShipping(e.target.value)}
                  value={shipping}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            {/* === ৩. হাইলাইটস === */}
            <div className="variant-box p-3 mb-4">
              <h6>Quick Highlights (e.g. 1 Year Warranty, Free Delivery)</h6>
              {highlights.map((h, i) => (
                <div key={i} className="mb-2 d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Highlight ${i + 1}`}
                    value={h}
                    onChange={(e) => handleHighlightChange(i, e.target.value)}
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeHighlightRow(i)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-dark mt-1"
                onClick={addHighlightRow}
              >
                + Add Feature
              </button>
            </div>

            {/* === ৪. অ্যাডভান্সড ভেরিয়েন্ট === */}
            <div className="variant-box p-3 mb-4">
              <h6>Product Variants (Region, SIM, Specs)</h6>
              {variants.map((v, i) => (
                <div className="variant-grid-row mb-2">
                  {/* কালার ড্রপডাউন */}
                  <select
                    className="form-control"
                    value={v.color}
                    onChange={(e) =>
                      handleVariantChange(i, "color", e.target.value)
                    }
                  >
                    <option value="">Select Color</option>
                    {COLOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={v.ram}
                    onChange={(e) =>
                      handleVariantChange(i, "ram", e.target.value)
                    }
                  >
                    <option value="">RAM</option>
                    {RAM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={v.storage}
                    onChange={(e) =>
                      handleVariantChange(i, "storage", e.target.value)
                    }
                  >
                    <option value="">Storage</option>
                    {STORAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={v.region}
                    onChange={(e) =>
                      handleVariantChange(i, "region", e.target.value)
                    }
                  >
                    <option value="">Region</option>
                    {REGION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={v.simType}
                    onChange={(e) =>
                      handleVariantChange(i, "simType", e.target.value)
                    }
                  >
                    <option value="">SIM</option>
                    {SIM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={v.condition}
                    onChange={(e) =>
                      handleVariantChange(i, "condition", e.target.value)
                    }
                  >
                    <option value="">Condition</option>
                    {CONDITION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Price"
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(i, "price", e.target.value)
                    }
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={v.stock}
                    onChange={(e) =>
                      handleVariantChange(i, "stock", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-dark mt-1"
                onClick={addVariantRow}
              >
                + Add Variant
              </button>
            </div>

            {/* === ৫. স্পেসিফিকেশন টেবিল ডাটা === */}
            <div className="spec-box p-3 mb-4">
              <h6>Technical Specifications (Table Content)</h6>
              {specifications.map((s, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-md-3">
                    <input
                      placeholder="Category (e.g. Battery)"
                      className="form-control"
                      value={s.category}
                      onChange={(e) =>
                        handleSpecChange(i, "category", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      placeholder="Name (e.g. Capacity)"
                      className="form-control"
                      value={s.name}
                      onChange={(e) =>
                        handleSpecChange(i, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      placeholder="Value (e.g. 5000mAh)"
                      className="form-control"
                      value={s.value}
                      onChange={(e) =>
                        handleSpecChange(i, "value", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-1">
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => removeSpecRow(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-1"
                onClick={addSpecRow}
              >
                + Add Spec Row
              </button>
            </div>

            {/* === ৬. রিচ টেক্সট এডিটর === */}
            <div className="form-group mb-5">
              <label>Detailed Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                style={{ height: "250px" }}
              />
            </div>

            <button type="submit" className="btn-submit">
              PUBLISH PRODUCT
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
