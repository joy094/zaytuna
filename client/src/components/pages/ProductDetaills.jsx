// src/components/pages/ProductDetails.jsx

import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import "./ProductDetails.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart();

  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const [quantity, setQuantity] = useState(1);
  const contactNumber = "+8801817141213";

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      setMainImage(data?.product?.photo);

      if (data?.product?.variants?.length > 0) {
        const defaultVariant = data.product.variants[0];
        setSelectedVariant(defaultVariant);

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

  const handleAddToCart = () => {
    const finalProduct = selectedVariant
      ? { ...product, price: selectedVariant.price, selectedVariant, quantity }
      : { ...product, quantity };

    setCart([...cart, finalProduct]);
    localStorage.setItem("cart", JSON.stringify([...cart, finalProduct]));
    toast.success("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleWhatsAppOrder = () => {
    const price = selectedVariant ? selectedVariant.price : product?.price;
    const variantText = selectedVariant
      ? `\nVariant: ${selectedVariant.color || ""} ${selectedVariant.size || ""} ${selectedVariant.ram || ""}`
      : "";
    const text = `Hello, I want to order:\n\n*${product.name}*${variantText}\nQuantity: ${quantity}\nTotal Price: ৳${price * quantity}\n\nLink: ${window.location.href}`;
    window.open(
      `https://wa.me/${contactNumber.replace("+", "")}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleCallOrder = () => {
    window.location.href = `tel:${contactNumber}`;
  };

  // ================= কারেন্ট প্রাইস ক্যালকুলেশন =================
  const currentUnitPrice = selectedVariant
    ? selectedVariant.price
    : product?.price || 0;
  const currentDiscountPrice = product?.discountPrice || 0;

  return (
    <Layout>
      <div className="container product-details-page">
        <div className="details-grid">
          {/* ================= ছবি গ্যালারি সেকশন ================= */}
          <div className="details-img-container">
            <div className="main-img-box">
              {mainImage ? (
                <img src={mainImage} alt={product.name} />
              ) : (
                <div className="text-center p-5">Loading Image...</div>
              )}
            </div>
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

          {/* ================= প্রোডাক্ট ইনফো সেকশন ================= */}
          <div className="details-info">
            {product?.brand && (
              <span className="brand-badge">{product.brand}</span>
            )}
            <h1 className="details-title">{product.name}</h1>

            {/* ================= লাইভ প্রাইস আপডেট সেকশন ================= */}
            <div className="price-section d-flex flex-column align-items-start mb-4">
              <div>
                <span className="details-price">
                  ৳ {currentUnitPrice * quantity}
                </span>
                {currentDiscountPrice > 0 && (
                  <span className="discount-price ms-3">
                    ৳ {currentDiscountPrice * quantity}
                  </span>
                )}
              </div>

              {/* ইউজার ১-এর বেশি সিলেক্ট করলে প্রতি পিসের দাম ছোট করে দেখাবে */}
              {quantity > 1 && (
                <small className="text-muted mt-1 fw-bold">
                  (৳ {currentUnitPrice} / per item)
                </small>
              )}
            </div>

            {/* ভেরিয়েন্ট সিলেকশন */}
            {product?.variants?.length > 0 && (
              <div className="variant-section mt-3">
                <h6>Available Options (Select One):</h6>
                <div className="variant-grid">
                  {product.variants.map((v, index) => (
                    <div
                      key={index}
                      className={`variant-card ${selectedVariant === v ? "active" : ""}`}
                      onClick={() => {
                        setSelectedVariant(v);
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

            <div className="stock-info mt-3 mb-3">
              Status:{" "}
              <b
                className={
                  selectedVariant?.stock > 0 || product?.stock > 0
                    ? "text-success"
                    : "text-danger"
                }
              >
                {selectedVariant?.stock > 0 || product?.stock > 0
                  ? `In Stock`
                  : "Out of Stock"}
              </b>
            </div>

            {/* ================= প্রফেশনাল অ্যাকশন বাটন প্যানেল ================= */}
            <div className="action-buttons-wrapper">
              <div className="quantity-box-area">
                <span className="qty-label">Quantity:</span>
                <div className="custom-qty-counter">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input type="text" value={quantity} readOnly />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="main-action-btns">
                <button
                  className="btn-custom btn-cart"
                  disabled={
                    (selectedVariant && selectedVariant.stock <= 0) ||
                    (!selectedVariant && product.stock <= 0)
                  }
                  onClick={handleAddToCart}
                >
                  <i className="fa-solid fa-cart-plus me-2"></i> Add To Cart
                </button>
                <button
                  className="btn-custom btn-buy"
                  disabled={
                    (selectedVariant && selectedVariant.stock <= 0) ||
                    (!selectedVariant && product.stock <= 0)
                  }
                  onClick={handleBuyNow}
                >
                  <i className="fa-solid fa-bolt me-2"></i> Order Now
                </button>
              </div>

              <div className="support-action-btns">
                <button
                  className="btn-custom btn-whatsapp"
                  onClick={handleWhatsAppOrder}
                >
                  <i className="fa-brands fa-whatsapp me-2 fs-5"></i> WhatsApp
                  Order
                </button>
                <button
                  className="btn-custom btn-call"
                  onClick={handleCallOrder}
                >
                  <i className="fa-solid fa-phone me-2"></i> Call For Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ন্যাভিগেশন বাটন (Tabs) ================= */}
        <div className="product-nav-tabs mt-5">
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
