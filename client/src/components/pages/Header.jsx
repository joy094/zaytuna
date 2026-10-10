import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Search from "./Search";
import "./Header.css";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // সার্চ বারের জন্য নতুন স্টেট
  const navigate = useNavigate();

  const portalOptions = [
    { name: "Parent Portal", path: "/parent-portal" },
    { name: "Student Portal", path: "/student-portal" },
    { name: "Staff Portal", path: "/staff-portal" },
  ];

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ১. মোবাইল সাইডবার ওভারলে */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* ২. মূল হেডার */}
      <header className="navbar-area">
        <div className="nav-container">
          {/* ============ ১. বাম পাশ: ন্যাভ বাটন (For Mobile) ============ */}
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          {/* ============ ২. মাঝখান: লোগো ============ */}
          <div className="header-center">
            <div className="brand-logo">
              <Link to="/">
                <img
                  src="/img/madrasatuz-zaytuna-logo.svg"
                  alt="Madrasatuz Zaytuna Logo"
                  style={{ height: "50px", width: "auto" }}
                />
              </Link>
            </div>
          </div>

          {/* ============ ৩. ডান পাশ: একশন লিংকস ও সার্চ ============ */}
          <div className="header-right nav-actions flex items-center">
            {/* ডেক্সটপ মেনু লিংকস */}
            <div className="desktop-menu-links desktop-only flex gap-4 mr-4 items-center font-semibold text-gray-700">
              <NavLink
                to="/"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                About
              </NavLink>
              <NavLink
                to="/academic"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Academic
              </NavLink>
              <NavLink
                to="/tahfiz"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Tahfiz
              </NavLink>
              <NavLink
                to="/tarbiyah"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Tarbiyah
              </NavLink>
              <NavLink
                to="/admissions"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Admissions
              </NavLink>
              <NavLink
                to="/contact"
                className="nav-item hover:text-emerald-600 transition-colors"
              >
                Contact
              </NavLink>
            </div>

            {/* পোর্টাল ড্রপডাউন */}
            <div className="dropdown-wrapper desktop-only">
              <span className="nav-item has-dropdown bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md">
                Portal <i className="fa-solid fa-angle-down ms-1"></i>
              </span>
              <div className="dropdown-menu">
                {portalOptions.map((opt, index) => (
                  <NavLink key={index} to={opt.path} className="dropdown-link">
                    {opt.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ইউজার অথেন্টিকেশন */}
            {!auth.user ? (
              <div className="auth-links desktop-only ml-2">
                <NavLink
                  to="/login"
                  className="login-btn bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                >
                  Login
                </NavLink>
              </div>
            ) : (
              <div className="dropdown-wrapper desktop-only ml-2">
                <span className="nav-item has-dropdown user-name-badge bg-emerald-600 text-white px-3 py-1 rounded-md">
                  <i className="fa-regular fa-circle-user me-1"></i>
                  {auth?.user?.name.split(" ")[0]}
                </span>
                <div className="dropdown-menu user-menu">
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                    className="dropdown-link"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="dropdown-link logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* 🔴 নতুন: Expandable Search Icon (মোবাইল ও ডেক্সটপ উভয়ের জন্য) */}
            <div className="search-action-wrapper ml-4 relative">
              <button
                className="search-toggle-btn text-gray-700 hover:text-emerald-600 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  fontSize: "1.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                }}
              >
                <i
                  className={`fa-solid ${isSearchOpen ? "fa-xmark" : "fa-magnifying-glass"}`}
                ></i>
              </button>

              {/* সার্চ বক্স যা ক্লিকে ওপেন হবে */}
              <div
                className={`expandable-search-box ${isSearchOpen ? "open" : ""}`}
              >
                <Search />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ৩. মোবাইল সাইডবার (Drawer) - অপরিবর্তিত আছে */}
      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img
              src="/img/madrasatuz-zaytuna-logo.svg"
              alt="Madrasatuz Zaytuna Logo"
              style={{ height: "45px", width: "auto" }}
            />
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <button
            className="call-order-btn bg-emerald-100 text-emerald-800"
            onClick={() => (window.location.href = "tel:+8801817141213")}
          >
            <i className="fa-solid fa-phone-volume"></i> Call Admission Office
          </button>

          <div className="mobile-auth-section">
            {!auth.user ? (
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
              </NavLink>
            ) : (
              <>
                <div className="mobile-user-info">
                  <span className="fw-bold text-dark">
                    Hi, {auth?.user?.name}
                  </span>
                </div>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fa-solid fa-border-all"></i> Dashboard
                </NavLink>
                <button onClick={handleLogout} className="mobile-logout">
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </>
            )}
          </div>

          <p className="sidebar-label">Navigation Menu</p>
          <div className="sidebar-category-list">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Academic", path: "/academic" },
              { name: "Tahfiz", path: "/tahfiz" },
              { name: "Tarbiyah", path: "/tarbiyah" },
              { name: "Admissions", path: "/admissions" },
              { name: "Parent Portal", path: "/parent-portal" },
              { name: "Contact Us", path: "/contact" },
            ].map((menuItem, index) => (
              <NavLink
                key={index}
                to={menuItem.path}
                className="sidebar-cat-link"
                onClick={() => setIsOpen(false)}
              >
                <span>{menuItem.name}</span>
                <i className="fa-solid fa-chevron-right arrow-icon"></i>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
