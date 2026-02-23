import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules (যদি Navigation Arrows লাগে)
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "./CategorySection.css"; // এই কম্পোনেন্টের জন্য CSS

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
          // শুধু প্রথম ১০-১২টি পণ্য দেখান যাতে হোমপেজ ভারী না হয়
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
  if (!products || products.length === 0) return null; // কোনো প্রোডাক্ট না থাকলে সেকশন দেখাবে না

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
          slidesPerView={1.5} // মোবাইলে 1.5টি আইটেম
          spaceBetween={15}
          navigation={true} // নেভিগেশন অ্যারো দেখাবে
          modules={[Navigation]}
          className="productSwiper"
          breakpoints={{
            640: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 5.5,
              spaceBetween: 30,
            },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <Link to={`/product/${p.slug}`} className="product-card-link">
                <div className="product-card">
                  <div className="product-img-box">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                  </div>
                  <div className="product-info">
                    <h5 className="product-name">
                      {p.name.substring(0, 25)}
                      {p.name.length > 25 ? "..." : ""}
                    </h5>
                    <p className="product-price">৳ {p.price}</p>
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
