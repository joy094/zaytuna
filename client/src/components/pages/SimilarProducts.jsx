import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useCart } from "../../context/cart";

import "swiper/css";
import "swiper/css/navigation";
import "./SimilarProducts.css";

const SimilarProducts = ({ products, title = "Related Products" }) => {
  // যদি কোনো রিলেটেড প্রোডাক্ট না থাকে, তবে এই সেকশনটি দেখাবে না
  if (!products || products.length === 0) return null;

  return (
    <div className="similar-products-section">
      <div className="similar-section-header">
        <h3 className="similar-section-title">{title}</h3>
      </div>

      <div className="similar-slider-wrapper">
        <Swiper
          slidesPerView={2}
          spaceBetween={10}
          navigation={true}
          slidesPerGroup={1}
          modules={[Navigation]}
          className="similarProductSwiper"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            576: { slidesPerView: 2.5, spaceBetween: 15 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            992: { slidesPerView: 4.5, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 25 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p._id}>
              <Link
                to={`/product/${p.slug}`}
                className="similar-product-card-link"
              >
                <div className="similar-product-card">
                  <div className="similar-product-img-wrapper">
                    {/* ডিসকাউন্ট ব্যাজ */}
                    {p.offerPrice && p.offerPrice < p.price && (
                      <span className="similar-discount-badge">
                        -
                        {Math.round(((p.price - p.offerPrice) / p.price) * 100)}
                        %
                      </span>
                    )}
                    <img src={p.photo} alt={p.name} />
                  </div>

                  <div className="similar-product-info">
                    <h5 className="similar-product-name">
                      {p.name.substring(0, 40)}
                      {p.name.length > 40 ? "..." : ""}
                    </h5>

                    <div className="similar-price-container">
                      {p.offerPrice ? (
                        <>
                          <span className="similar-price-tag">
                            ৳ {p.offerPrice}
                          </span>
                          <span className="similar-original-price">
                            ৳ {p.price}
                          </span>
                        </>
                      ) : (
                        <span className="similar-price-tag">৳ {p.price}</span>
                      )}
                    </div>

                    {/* ডাইনামিক বাটন লজিক */}
                    {p.variants && p.variants.length > 0 ? (
                      <button className="similar-add-to-cart-btn">
                        Select Options
                      </button>
                    ) : (
                      <button
                        className="similar-add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Added to cart directly:", p.name);
                          // আপনার Add to Cart ফাংশন এখানে কল করবেন
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

export default SimilarProducts;
