// src/components/HeroSlider.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBanners = async () => {
    try {
      const { data } = await axios.get("/api/v1/banner/get-banners");
      if (data?.success) {
        setBanners(data.banners);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error loading banners:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  if (loading) {
    return (
      <div
        className="hero-slider-container d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <h4>Loading Slider...</h4>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="hero-slider-container">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="banner-slide-wrapper">
              {/* সরাসরি ইমেজ ট্যাগ ব্যবহার করা হলো যা কখনো কাটবে না */}
              <img
                src={banner.photo}
                alt={banner.title || "Banner"}
                className="responsive-banner-img"
              />

              <div className="banner-content">
                {banner.title && <h1>{banner.title}</h1>}
                {banner.subtitle && <p>{banner.subtitle}</p>}
                {banner.link && (
                  <a href={banner.link} className="banner-button">
                    Shop Now
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
