import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "./CategorySection.css";

const CategorySection = ({ title, slug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProductsByCat = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/product/product-category/${slug}`,
        );
        if (data?.success) {
          // প্রথম ১২টি পণ্য দেখান
          setProducts(data?.products.slice(0, 12));
        } else {
          setError("Failed to fetch products for this category.");
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Error loading products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProductsByCat();
    }
  }, [slug]);

  if (loading)
    return <div className="category-section-loading">Loading {title}...</div>;
  if (error) return <div className="category-section-error">{error}</div>;
  if (!products || products.length === 0) return null;

  return (
    <div className="category-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        <Link to={`/category/${slug}`} className="see-all-button">
          See All <i className="fa-solid fa-chevron-right"></i>
        </Link>
      </div>

      <div className="product-slider-wrapper">
        <Swiper
          slidesPerView={2} // মোবাইলে ২টি আইটেম পাশাপাশি
          spaceBetween={15}
          navigation={true}
          modules={[Navigation]}
          className="productSwiper"
          breakpoints={{
            576: {
              slidesPerView: 2.5,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
            992: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <Link
                to={`/product/${p.slug}`}
                className="product-card-link"
                style={{ textDecoration: "none" }}
              >
                <div className="product-card">
                  {/* ক্লাসের নাম Home.css এর সাথে মেলানো হলো */}
                  <div className="product-img-wrapper">
                    <img src={p.photo} alt={p.name} />
                  </div>
                  <div className="product-info">
                    <h5 className="product-name">
                      {p.name.substring(0, 40)}
                      {p.name.length > 40 ? "..." : ""}
                    </h5>
                    <p className="price-tag">৳ {p.price}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;
