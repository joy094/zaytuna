//src/components/pages/Header.jsx

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import "./Header.css"; // Header এর জন্য আলাদা CSS ফাইল

//Header Components

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্ট্যাটাস
  const [categories, setCategories] = useState([]); // ক্যাটাগরি স্টেট

  // সব ক্যাটাগরি ডাটাবেজ থেকে আনার ফাংশন
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful");
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="logo">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "1.5rem",
            }}
          >
            LOGO
          </Link>
        </div>
       

       <div className="search-container">
         <Search />
       </div>

        {/* হ্যামবার্গার আইকন বাটন */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${isOpen ? "mobile-active" : ""}`}>
          {/* --- মোবাইল ভিউ ক্যাটাগরি সেকশন --- */}
          <div className="sidebar-categories">
            <div className="sidebar-header-box">
              <button
                className="call-order"
                onClick={() => (window.location.href = "tel:+8801860989372")}
              >
                <i className="fa-solid fa-phone"></i> Call for Order
              </button>
            </div>

            <p className="category-label">All Categories</p>
            <div className="category-list">
              {categories?.map((c) => (
                <NavLink
                  key={c._id}
                  to={`/category/${c.slug}`}
                  className="sidebar-cat-item"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{c.name}</span>
                  <i className="fa-solid fa-chevron-right arrow-icon"></i>
                </NavLink>
              ))}
            </div>
          </div>
          {/* ---------------------------------- */}

          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>

          {/* --- ডেক্সটপ ক্যাটাগরি ড্রপডাউন (নতুন যোগ করা হলো) --- */}
          {/* ডেক্সটপ ক্যাটাগরি */}
          <div className="desktop-nav-category">
            <details className="dropdown">
              <summary className="dropdown-title">Categories ▾</summary>
              <div className="dropdown-content">
                {categories?.map((c) => (
                  <NavLink key={c._id} to={`/category/${c.slug}`}>
                    {c.name}
                  </NavLink>
                ))}
              </div>
            </details>
          </div>
          {/* --------------------------------------------------- */}

          <NavLink
            to="/cart"
            className="cart-nav-link"
            onClick={() => setIsOpen(false)}
          >
            <div className="cart-icon-container">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="cart-badge">{cart?.length}</span>
            </div>
          </NavLink>
          {!auth.user ? (
            <>
              <NavLink to="/register" onClick={() => setIsOpen(false)}>
                Register
              </NavLink>
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
            </>
          ) : (
            <details className="dropdown">
              <summary className="dropdown-title">{auth?.user?.name} ▾</summary>
              <div className="dropdown-content">
                <NavLink
                  onClick={() => setIsOpen(false)}
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                >
                  Dashboard
                </NavLink>
                <Link
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  to="/login"
                  className="logout-link"
                >
                  Logout
                </Link>
              </div>
            </details>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
