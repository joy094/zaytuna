import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./CategorySection.css";

const CategorySection = ({ title, slug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductsByCat = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/product/product-category/${slug}`,
        );
        if (data?.success) {
          setProducts(data?.products.slice(0, 12));
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProductsByCat();
    }
  }, [slug]);

  // যদি কোনো প্রোডাক্ট না থাকে এবং লোডিংও শেষ হয়, তবে সেকশন দেখাবে না
  if (!loading && (!products || products.length === 0)) return null;

  return (
    <div className="category-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {!loading && (
          <Link to={`/category/${slug}`} className="see-all-button">
            See All <i className="fa-solid fa-chevron-right"></i>
          </Link>
        )}
      </div>

      <div className="product-slider-wrapper">
        <Swiper
          slidesPerView={2}
          spaceBetween={15}
          navigation={!loading} // লোডিংয়ের সময় অ্যারো হাইড থাকবে
          modules={[Navigation]}
          className="productSwiper"
          breakpoints={{
            576: { slidesPerView: 2.5, spaceBetween: 15 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            992: { slidesPerView: 4.5, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 25 },
          }}
        >
          {loading
            ? // ডেটা আসার আগে ৪টি ফেক স্কিলেটন কার্ড দেখাবে (ব্ল্যাংক ভাব দূর করার জন্য)
              [1, 2, 3, 4, 5].map((n) => (
                <SwiperSlide key={n}>
                  <div className="product-card skeleton-card">
                    <div className="product-img-wrapper skeleton-box"></div>
                    <div className="product-info">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line price"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : // আসল প্রোডাক্টগুলো
              products.map((p) => (
                <SwiperSlide key={p._id}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="product-card-link"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="product-card">
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
