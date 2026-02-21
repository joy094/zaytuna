// Home Page Updated slider logic
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Custom CSS for HomePage

const Home = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // প্রোডাক্ট লোড করার ফাংশন (আগের মতোই)
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) setProducts(data.products);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // স্লাইডার অটো-প্লে লজিক
  useEffect(() => {
    if (products.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === products.slice(0, 5).length - 1 ? 0 : prev + 1,
        );
      }, 4000);
      return () => clearInterval(slideInterval);
    }
  }, [products]);

  // কার্টে অ্যাড করার কমন ফাংশন
  const handleAddToCart = (p) => {
    setCart([...cart, p]);
    localStorage.setItem("cart", JSON.stringify([...cart, p]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="home-container">
        {/* Pure CSS Slider */}
        <div className="custom-slider">
          {products?.slice(0, 5).map((p, index) => (
            <div
              className={index === currentSlide ? "slide active" : "slide"}
              key={p._id}
            >
              {index === currentSlide && (
                <div className="slider-content">
                  <div className="slider-text">
                    <h1 className="animate-top">{p.name}</h1>
                    <p className="animate-bottom">
                      {p.description.substring(0, 100)}...
                    </p>
                    <h3 style={{ color: "#e94560", marginBottom: "15px" }}>
                      ৳ {p.price}
                    </h3>

                    {/* Shop Now বাটন এখন কার্টে অ্যাড করবে */}
                    <button
                      className="shop-btn"
                      onClick={() => handleAddToCart(p)}
                    >
                      Shop Now
                    </button>
                  </div>
                  <div className="slider-image">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/product/${p.slug}`)} // ছবিতে ক্লিক করলে ডিটেইলসে যাবে
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Slider Dots */}
          <div className="slider-dots">
            {products?.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={i === currentSlide ? "dot active" : "dot"}
                onClick={() => setCurrentSlide(i)}
              ></span>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-section">
          <h2 className="section-title">Latest Products</h2>
          <div className="product-grid">
            {products?.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-img-wrapper">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="price-tag">৳ {p.price}</p>
                  <div className="product-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-cart"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default Home;
