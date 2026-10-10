//src/components/pages/Layout.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget the CSS!

import Header from "./Header";
import Footer from "./Footer";

// import "./Layout.css"; // Layout এর জন্য আলাদা CSS ফাইল

// Layout Component
export const Layout = ({ children, title = "Barakahmart" }) => {
  const [cart] = useCart();
  const [auth] = useAuth();

  return (
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

      <main className="main-content" style={{ minHeight: "80vh" }}>
        {children}
      </main>

      {/* Bottom Navigation for Mobile (Madrasa Version) */}
      <div className="bottom-nav">
        {/* ১. Home */}
        <Link to="/" className="nav-item">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>

        {/* ২. Academic */}
        <Link to="/academic" className="nav-item">
          <i className="fa-solid fa-book-open-reader"></i>
          <span>Academic</span>
        </Link>

        {/* ৩. Admissions */}
        <Link to="/admissions" className="nav-item">
          <i className="fa-solid fa-graduation-cap"></i>
          <span>Admission</span>
        </Link>

        {/* ৪. Account / Portal (আপনার আগের Conditional Logic) */}
        <Link
          to={
            auth?.user
              ? `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`
              : "/login"
          }
          className="nav-item"
        >
          <i className="fa-solid fa-user"></i>
          <span>Account</span>
        </Link>
      </div>

      <ToastContainer autoClose={2000} />
      <Footer />
    </div>
  );
};

export default Layout;
