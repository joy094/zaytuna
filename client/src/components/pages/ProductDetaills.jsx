// ProductDetails.jsx

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

  // বাই-ডিফল্ট Description ট্যাব অ্যাক্টিভ থাকবে
  const [activeTab, setActiveTab] = useState("description");

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);

      // মেইন ছবি সেট করা
      setMainImage(data?.product?.photo);

      if (data?.product?.variants?.length > 0) {
        const defaultVariant = data.product.variants[0];
        setSelectedVariant(defaultVariant);

        // ফিক্স: photoIndex স্ট্রিং হিসেবে আসলে সেটাকে Number এ কনভার্ট করা
        if (
          defaultVariant.photoIndex !== undefined &&
          defaultVariant.photoIndex !== null &&
          defaultVariant.photoIndex !== ""
        ) {
          const pIdx = Number(defaultVariant.photoIndex);
          if (data.product.extraPhotos?.[pIdx]) {
            setMainImage(data.product.extraPhotos[pIdx]);
          }
        }
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

            {/* ================= ফিক্স: Cloudinary গ্যালারি থাম্বনেইল ================= */}
            <div className="thumbnail-gallery">
              {product?.photo && (
                <img
                  src={product.photo}
                  className={`thumb ${mainImage === product.photo ? "active" : ""}`}
                  onClick={() => setMainImage(product.photo)}
                  alt="main"
                />
              )}
              {product?.extraPhotos?.map((photoUrl, index) => (
                <img
                  key={index}
                  src={photoUrl}
                  className={`thumb ${mainImage === photoUrl ? "active" : ""}`}
                  onClick={() => setMainImage(photoUrl)}
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

            {/* ================= Highlights ================= */}
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

            {/* ================= ভেরিয়েন্ট বক্স ও ছবি চেঞ্জ লজিক ================= */}
            {product?.variants?.length > 0 && (
              <div className="variant-section mt-4">
                <h6>Available Options (Select One):</h6>
                <div className="variant-grid">
                  {product.variants.map((v, index) => (
                    <div
                      key={index}
                      className={`variant-card ${selectedVariant === v ? "active" : ""}`}
                      onClick={() => {
                        setSelectedVariant(v);

                        // ম্যাজিক লজিক: Number() দিয়ে ভেরিফাই করা হচ্ছে
                        if (
                          v.photoIndex !== undefined &&
                          v.photoIndex !== null &&
                          v.photoIndex !== ""
                        ) {
                          const pIdx = Number(v.photoIndex);
                          if (product?.extraPhotos?.[pIdx]) {
                            setMainImage(product.extraPhotos[pIdx]);
                          } else {
                            setMainImage(product?.photo);
                          }
                        } else {
                          setMainImage(product?.photo);
                        }
                      }}
                    >
                      {(v.ram || v.storage) && (
                        <div className="var-main">
                          {v.ram ? `${v.ram}` : ""}{" "}
                          {v.ram && v.storage ? "/" : ""}{" "}
                          {v.storage ? `${v.storage}` : ""}
                        </div>
                      )}

                      {(v.region || v.simType) && (
                        <div className="var-sub">
                          {v.region} {v.simType ? `• ${v.simType}` : ""}
                        </div>
                      )}

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
          {groupedSpecs && Object.keys(groupedSpecs).length > 0 && (
            <button
              className={`nav-tab-btn ${activeTab === "specification" ? "active" : ""}`}
              onClick={() => scrollToSection("specification")}
            >
              Specifications
            </button>
          )}

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

        {/* ================= বিস্তারিত সেকশনসমূহ ================= */}
        <div className="scrollable-content-area">
          {groupedSpecs && Object.keys(groupedSpecs).length > 0 && (
            <div id="specification" className="scroll-section">
              <h4 className="section-heading border-bottom pb-2">
                Product Specifications
              </h4>
              <div className="spec-table-wrapper mt-3">
                {Object.keys(groupedSpecs).map((category, index) => (
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
          )}

          <div id="description" className="scroll-section mt-5">
            <h4 className="section-heading border-bottom pb-2">
              Product Overview
            </h4>
            <div
              className="rich-content mt-3"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            />
          </div>

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
