import React from "react";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./HeroSlider.css"; // এই কম্পোনেন্টের জন্য CSS

const HeroSlider = () => {
  const banners = [
    {
      id: 1,
      image: "https://swiperjs.com/demos/images/nature-1.jpg", // আপনার ব্যানার ইমেজ দিন
      title: "বিশেষ অফার! সব পণ্যে ২৫% ছাড়",
      subtitle: "সীমিত সময়ের জন্য",
      link: "/shop/offer",
    },
    {
      id: 2,
      image: "https://swiperjs.com/demos/images/nature-2.jpg",
      title: "নতুন সংগ্রহ",
      subtitle: "আপনার পছন্দের সব পণ্য এখন এক জায়গায়",
      link: "/shop/new-arrivals",
    },
    {
      id: 3,
      image: "https://swiperjs.com/demos/images/nature-3.jpg",
      title: "ফ্রি হোম ডেলিভারি",
      subtitle: "৫০0 টাকার উপরে অর্ডারে",
      link: "/shop/delivery-info",
    },
  ];

  return (
    <div className="hero-slider-container">
      <Swiper
        spaceBetween={30}
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
          <SwiperSlide key={banner.id}>
            <div
              className="banner-slide"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="banner-content">
                <h1>{banner.title}</h1>
                <p>{banner.subtitle}</p>
                <a href={banner.link} className="banner-button">
                  Shop Now
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
