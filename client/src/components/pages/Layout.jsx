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
          href="https://wa.me/8801860989372"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-float"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a
          href="https://www.facebook.com/share/1CYYZC9q9F/"
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

      {/* Bottom Navigation for Mobile */}
      <div className="bottom-nav">
        <Link to="/" className="nav-item">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>

        {/* Orders Button (Conditional Logic) */}
        <Link
          to={`/dashboard/${auth?.user?.role === 1 ? "admin/orders" : "user/orders"}`}
          className="nav-item"
        >
          <i className="fa-solid fa-bag-shopping"></i>
          <span>{auth?.user?.role === 1 ? "Manage" : "Orders"}</span>
        </Link>

        {/* <Link to="/dashboard/user/orders" className="nav-item">
          <i className="fa-solid fa-bag-shopping"></i>
          <span>Orders</span>
        </Link> */}
        <Link to="/cart" className="nav-item">
          <div className="cart-icon-container">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-badge">{cart?.length}</span>
          </div>
          <span>Cart</span>
        </Link>
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
