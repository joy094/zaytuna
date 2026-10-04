// CategorySection.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./CategorySection.css";

const CategorySection = ({ title, slug }) => {
  const [products, setProducts] = useState(() => {
    const savedData = localStorage.getItem(`cache_${slug}`);
    return savedData ? JSON.parse(savedData) : [];
  });

  const [loading, setLoading] = useState(() => {
    return localStorage.getItem(`cache_${slug}`) ? false : true;
  });

  useEffect(() => {
    const getProductsByCat = async () => {
      try {
        if (products.length === 0) setLoading(true);

        const { data } = await axios.get(
          `/api/v1/product/product-category/${slug}`,
        );
        if (data?.success) {
          const fetchedProducts = data?.products.slice(0, 12);
          setProducts(fetchedProducts);

          localStorage.setItem(
            `cache_${slug}`,
            JSON.stringify(fetchedProducts),
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
          spaceBetween={10}
          navigation={!loading} /* অ্যারো চিহ্ন এনাবল করা হলো */
          slidesPerGroup={1} /* 🔴 ম্যাজিক: ক্লিকে ১টা করে স্লাইড হবে */
          modules={[Navigation]}
          className="productSwiper"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            576: { slidesPerView: 2.5, spaceBetween: 15 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            992: { slidesPerView: 4.5, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 25 },
          }}
        >
          {loading
            ? [1, 2, 3, 4, 5].map((n) => (
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
            : products.map((p) => (
                <SwiperSlide key={p._id}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="product-card-link"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="product-card">
                      <div className="product-img-wrapper">
                        {/* ============ ১. ডিসকাউন্ট ব্যাজ (পার্সেন্টেজ) ============ */}
                        {p.offerPrice && p.offerPrice < p.price && (
                          <span className="discount-badge">
                            -
                            {Math.round(
                              ((p.price - p.offerPrice) / p.price) * 100,
                            )}
                            %
                          </span>
                        )}

                        <img src={p.photo} alt={p.name} />
                      </div>

                      <div className="product-info">
                        <h5 className="product-name">
                          {p.name.substring(0, 40)}
                          {p.name.length > 40 ? "..." : ""}
                        </h5>

                        <div className="price-container">
                          {p.offerPrice ? (
                            <>
                              <span className="price-tag">
                                ৳ {p.offerPrice}
                              </span>
                              <span className="original-price-strike">
                                ৳ {p.price}
                              </span>
                            </>
                          ) : (
                            <span className="price-tag">৳ {p.price}</span>
                          )}
                        </div>

                        {/* ============ ২. ডাইনামিক বাটন লজিক ============ */}
                        {/* শর্ত: ডাটাবেজে যদি variants/sizes/colors এর অ্যারে থাকে এবং সেটি ১টার বেশি হয় */}
                        {p.variants && p.variants.length > 0 ? (
                          <button
                            className="add-to-cart-btn"
                            // Select Options এ ক্লিক করলে সরাসরি প্রোডাক্ট পেজে যাবে।
                            // (যেহেতু পুরো কার্ডটি Link করা, তাই এখানে preventDefault দিইনি)
                          >
                            Select Options
                          </button>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            onClick={(e) => {
                              // Add to Cart এ ক্লিক করলে লিংকে যাওয়া বন্ধ করে সরাসরি কার্টে যুক্ত করবে
                              e.preventDefault();
                              e.stopPropagation();

                              // আপনার Cart ফাংশন এখানে বসাবেন
                              console.log("Added to cart directly:", p.name);
                            }}
                          >
                            <i className="fa-solid fa-cart-shopping"></i> Add to
                            Cart
                          </button>
                        )}
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
