import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import "./ProductDetails.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart();

  // ডাইনামিক স্টেট
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("specification");

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      setMainImage(`/api/v1/product/product-photo/${data?.product._id}`);
      if (data?.product?.variants?.length > 0) {
        setSelectedVariant(data.product.variants[0]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading product details");
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const groupedSpecs = product?.specifications?.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const getValidColor = (colorName) => {
    const colors = {
      black: "#1c1c1c",
      white: "#f8f9fa",
      silver: "#c0c0c0",
      gray: "#808080",
      "space gray": "#535150",
      titanium: "#878681",
      "natural titanium": "#b5b5b1",
      blue: "#215f9b",
      "pacific blue": "#2e4755",
      red: "#d92027",
      green: "#4caf50",
      midnight: "#191f28",
      starlight: "#f8f9f4",
      gold: "#e6c387",
      purple: "#7f5283",
      yellow: "#ffd23f",
      pink: "#ffc0cb",
    };
    const normalized = colorName?.toLowerCase().trim() || "";
    return colors[normalized] || normalized;
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <div className="container product-details-page">
        {/* ================= টপ সেকশন: ছবি ও ইনফো ================= */}
        <div className="details-grid">
          <div className="details-img-container">
            <div className="main-img-box">
              {mainImage ? (
                <img src={mainImage} alt={product.name} />
              ) : (
                <div className="text-center p-5">Loading Image...</div>
              )}
            </div>
            <div className="thumbnail-gallery">
              {product?._id && (
                <img
                  src={`/api/v1/product/product-photo/${product._id}`}
                  className={`thumb ${mainImage.includes("product-photo") ? "active" : ""}`}
                  onClick={() =>
                    setMainImage(`/api/v1/product/product-photo/${product._id}`)
                  }
                  alt="main"
                />
              )}
              {product?.extraPhotos?.map((p, index) => (
                <img
                  key={index}
                  src={`/api/v1/product/extra-photo/${product._id}/${index}`}
                  className={`thumb ${mainImage.includes(`/extra-photo/${product._id}/${index}`) ? "active" : ""}`}
                  onClick={() =>
                    setMainImage(
                      `/api/v1/product/extra-photo/${product._id}/${index}`,
                    )
                  }
                  alt={`gallery-${index}`}
                />
              ))}
            </div>
          </div>

          <div className="details-info">
            {product?.brand && (
              <span className="brand-badge">{product.brand}</span>
            )}
            <h1 className="details-title">{product.name}</h1>

            {/* ================= Highlights Fix ================= */}
            {(() => {
              let highlightsArray = [];
              if (product?.highlights) {
                try {
                  if (typeof product.highlights === "string") {
                    highlightsArray = JSON.parse(product.highlights);
                  } else if (Array.isArray(product.highlights)) {
                    if (
                      product.highlights.length > 0 &&
                      typeof product.highlights[0] === "string" &&
                      product.highlights[0].startsWith("[")
                    ) {
                      highlightsArray = JSON.parse(product.highlights[0]);
                    } else {
                      highlightsArray = product.highlights;
                    }
                  }
                } catch (e) {
                  highlightsArray = Array.isArray(product.highlights)
                    ? product.highlights
                    : [];
                }
              }

              return highlightsArray.length > 0 ? (
                <ul className="product-highlights">
                  {highlightsArray.map((h, i) => (
                    <li key={i}>✓ {h}</li>
                  ))}
                </ul>
              ) : null;
            })()}

            <div className="price-section">
              <span className="details-price">
                ৳ {selectedVariant ? selectedVariant.price : product?.price}
              </span>
              {product?.discountPrice > 0 && (
                <span className="discount-price">
                  ৳ {product.discountPrice}
                </span>
              )}
            </div>

            {/* ================= Variant Box Fix ================= */}
            {product?.variants?.length > 0 && (
              <div className="variant-section mt-4">
                <h6>Available Options (Select One):</h6>
                <div className="variant-grid">
                  {product.variants.map((v, index) => (
                    <div
                      key={index}
                      className={`variant-card ${selectedVariant === v ? "active" : ""}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {/* যদি RAM বা Storage থাকে, তবেই দেখাবে */}
                      {(v.ram || v.storage) && (
                        <div className="var-main">
                          {v.ram ? `${v.ram}` : ""}{" "}
                          {v.ram && v.storage ? "/" : ""}{" "}
                          {v.storage ? `${v.storage}` : ""}
                        </div>
                      )}

                      {/* যদি Region বা SimType থাকে, তবেই দেখাবে */}
                      {(v.region || v.simType) && (
                        <div className="var-sub">
                          {v.region} {v.simType ? `• ${v.simType}` : ""}
                        </div>
                      )}

                      {/* কালার থাকলে দেখাবে */}
                      {v.color && (
                        <div className="var-color-wrapper">
                          <span
                            className="color-circle"
                            style={{ backgroundColor: getValidColor(v.color) }}
                            title={v.color}
                          ></span>
                          <span className="var-color-text">
                            {v.color} {v.condition ? `(${v.condition})` : ""}
                          </span>
                        </div>
                      )}

                      {/* যদি উপরের কিছুই না থাকে (যেমন সাবানের ক্ষেত্রে), তবে শুধু অপশনের নাম বা ডিফল্ট কিছু দেখাবে */}
                      {!v.ram && !v.storage && !v.color && (
                        <div className="var-main">Variant {index + 1}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="stock-info mt-3">
              Status:{" "}
              <b
                className={
                  selectedVariant?.stock > 0 ? "text-success" : "text-danger"
                }
              >
                {selectedVariant?.stock > 0 ? `In Stock` : "Out of Stock"}
              </b>
            </div>

            <button
              className="btn-cart-large mt-4"
              disabled={selectedVariant?.stock <= 0}
              onClick={() => {
                const finalProduct = selectedVariant
                  ? {
                      ...product,
                      price: selectedVariant.price,
                      selectedVariant,
                    }
                  : product;
                setCart([...cart, finalProduct]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, finalProduct]),
                );
                toast.success("Added to cart successfully!");
              }}
            >
              {selectedVariant?.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
          </div>
        </div>

        {/* ================= ন্যাভিগেশন বাটন (Tabs) ================= */}
        <div className="product-nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === "specification" ? "active" : ""}`}
            onClick={() => scrollToSection("specification")}
          >
            Specification
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => scrollToSection("description")}
          >
            Description
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "warranty" ? "active" : ""}`}
            onClick={() => scrollToSection("warranty")}
          >
            Warranty Policy
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => scrollToSection("reviews")}
          >
            Customer Reviews (0)
          </button>
        </div>

        {/* ================= বিস্তারিত সেকশনসমূহ (স্ক্রল টার্গেট) ================= */}
        <div className="scrollable-content-area">
          {/* স্পেসিফিকেশন সেকশন */}
          <div id="specification" className="scroll-section">
            <h4 className="section-heading border-bottom pb-2">
              Technical Specifications
            </h4>
            <div className="spec-table-wrapper mt-3">
              {groupedSpecs &&
                Object.keys(groupedSpecs).map((category, index) => (
                  <div key={index} className="spec-group">
                    <table className="spec-table">
                      <tbody>
                        {groupedSpecs[category].map((spec, i) => (
                          <tr key={i}>
                            <td className="spec-category">
                              {i === 0 ? category : ""}
                            </td>
                            <td className="spec-name">{spec.name}</td>
                            <td className="spec-value">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          </div>

          {/* ডেসক্রিপশন সেকশন */}
          <div id="description" className="scroll-section mt-5">
            <h4 className="section-heading border-bottom pb-2">
              Product Overview
            </h4>
            <div
              className="rich-content mt-3"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            />
          </div>

          {/* ওয়ারেন্টি সেকশন */}
          <div id="warranty" className="scroll-section mt-5">
            <h4 className="section-heading border-bottom pb-2">
              Warranty Policy
            </h4>
            <div className="mt-3">
              <p>✔ 10 Days Replacement Warranty</p>
              <p>
                ✔ 1 Year Service Warranty (Depends on official/unofficial
                variant)
              </p>
              <p>
                <i>
                  Note: Physical damage or liquid damage is not covered under
                  warranty.
                </i>
              </p>
            </div>
          </div>

          {/* রিভিউ সেকশন (আপাতত ফাঁকা) */}
          <div id="reviews" className="scroll-section mt-5 mb-5">
            <h4 className="section-heading border-bottom pb-2">
              Customer Reviews
            </h4>
            <div className="text-muted mt-3">
              <p>
                No reviews have been submitted yet. Be the first to review this
                product!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
