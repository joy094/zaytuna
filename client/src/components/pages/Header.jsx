import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
// import "./Header.css"; // Header এর জন্য আলাদা CSS ফাইল

//Header Components

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্ট্যাটাস

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
            🛒 Barakahmart
          </Link>
        </div>

        {/* হ্যামবার্গার আইকন বাটন */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${isOpen ? "mobile-active" : ""}`}>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>

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