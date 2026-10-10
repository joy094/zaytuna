//src/components/pages/Layout.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation ইমপোর্ট করা হয়েছে
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import Footer from "./Footer";

// import "./Layout.css"; // Layout এর জন্য আলাদা CSS ফাইল

// Layout Component
export const Layout = ({ children, title = "Barakahmart" }) => {
  const [cart] = useCart();
  const [auth] = useAuth();
  const location = useLocation(); // বর্তমান রাউট (URL) ট্র্যাক করার জন্য

  // Account লিংকের অ্যাকটিভ স্টেট চেক করার লজিক
  const isAccountActive = location.pathname.includes('/dashboard') || location.pathname === '/login';

  return (
    // 'layout-container' বা ফুটারের সিএসএস-এ প্যাডিং দিতে হবে (নিচে সিএসএস দেওয়া আছে)
    <div className="layout-wrapper">
      <Header />

      {/* Floating Social Buttons */}
      <div className="social-float">
        <a
          href="https://wa.me/+8801841515454"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-float"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a
          href="https://www.facebook.com/share/1F2rmdd6tH/"
          target="_blank"
          rel="noreferrer"
          className="fb-float"
        >
          <i className="fa-brands fa-facebook"></i>
        </a>
      </div>

      {/* মোবাইলে বটম নেভিগেশনের কারণে কন্টেন্ট যাতে ঢাকা না পড়ে তাই marginBottom যোগ করা হলো */}
      <main className="main-content" style={{ minHeight: "80vh", paddingBottom: "70px" }}>
        {children}
      </main>

      <Footer />

      {/* Bottom Navigation for Mobile (Madrasa Version) */}
      <div className="bottom-nav">
        {/* ১. Home */}
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>

        {/* ২. Academic */}
        <Link 
          to="/academic" 
          className={`nav-item ${location.pathname === "/academic" ? "active" : ""}`}
        >
          <i className="fa-solid fa-book-open-reader"></i>
          <span>Academic</span>
        </Link>

        {/* ৩. Admissions */}
        <Link 
          to="/admissions" 
          className={`nav-item ${location.pathname === "/admissions" ? "active" : ""}`}
        >
          <i className="fa-solid fa-graduation-cap"></i>
          <span>Admission</span>
        </Link>

        {/* ৪. Account / Portal */}
        <Link
          to={
            auth?.user
              ? `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`
              : "/login"
          }
          className={`nav-item ${isAccountActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-user"></i>
          <span>Account</span>
        </Link>
      </div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Layout;