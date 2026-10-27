//src/components/pages/Header.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { FaBell } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনুর স্টেট
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null); // মোবাইলের সাব-মেনু ওপেন রাখার স্টেট
  const navigate = useNavigate();

  // নোটিফিকেশন স্টেটস
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const portalOptions = [
    { name: "Parent Portal", path: "/parent-portal" },
    { name: "Student Portal", path: "/student-portal" },
    { name: "Staff Portal", path: "/staff-portal" },
  ];

  // ==========================================
  // ক্লায়েন্টের সাইটম্যাপ অনুযায়ী মেনু ডেটা
  // ==========================================
  const menuData = [
    { name: "Home", path: "/" },
    {
      name: "About",
      path: "/about",
      dropdown: [
        // { name: "Overview of Madrasatuz Zaytuna", path: "/about" },
        { name: "Prospectus 2027", path: "/about#prospectus" },
        { name: "About Us", path: "/about" },
        { name: "Message from the Chairman", path: "/about#chairman" },
        { name: "Why Choose Us?", path: "/about#why-choose-us" },
        { name: "Community Engagement", path: "/about#community" },
      ],
    },
    {
      name: "Academics",
      path: "/academic",
      dropdown: [
        { name: "Academic Overview", path: "/academic" },
        { name: "Integrated Foundation", path: "/academic#foundation" },
        { name: "Full Pathway", path: "/academic#pathway" },
        { name: "Tahfiz Wing", path: "/tahfiz" },
        { name: "Academic Calendar", path: "/academic#calendar" },
      ],
    },
    {
      name: "Admissions",
      path: "/admissions",
      dropdown: [
        { name: "Admission Policy", path: "/admissions" },
        { name: "Admission Procedure", path: "/admissions#procedure" },
        { name: "Waiver and Scholarship", path: "/admissions#scholarship" },
        { name: "Apply Online", path: "/admissions#apply" },
        { name: "Fees and Payments", path: "/admissions#fees" },
      ],
    },
    {
      name: "Media & Events",
      path: "/media",
      dropdown: [
        { name: "Parenting Sessions", path: "/media/parenting" },
        { name: "Halaqah", path: "/media/halaqah" },
        { name: "Training", path: "/media/training" },
        { name: "Photo Gallery", path: "/media/photos" },
        { name: "Video Gallery", path: "/media/videos" },
      ],
    },
    {
      name: "Notices",
      path: "/notice",
      dropdown: [
        { name: "Career", path: "/notice#career" },
        { name: "Academic Notice", path: "/notice#academic" },
        { name: "Official Notice", path: "/notice#official" },
      ],
    },
  ];

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful");
    setIsOpen(false);
    navigate("/login");
  };

  // নোটিফিকেশন ফেচ করা
  const fetchNotifications = async () => {
    try {
      const axios = (await import("axios")).default;
      const res = await axios.get("/api/v1/admission/notifications", {
        headers: { Authorization: auth?.token },
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.log("Error loading notifications");
    }
  };

  const handleNotifClick = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      setUnreadCount(0);
      try {
        const axios = (await import("axios")).default;
        await axios.put(
          "/api/v1/admission/notifications/mark-read",
          {},
          {
            headers: { Authorization: auth?.token },
          },
        );
      } catch (error) {
        console.log("Error marking as read");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (auth?.token && auth?.user) {
      fetchNotifications();
      const socket = io(import.meta.env.VITE_API_URL || "/");
      const room = auth.user.role === 1 ? "admin_room" : auth.user._id;
      socket.emit("join", room);

      socket.on("receive_notification", (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {});
        toast.info(`🔔 ${newNotif.title}`);
      });

      return () => socket.disconnect();
    }
  }, [auth?.token, auth?.user]);

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
          {/* ============ ১. বাম পাশ: হ্যামবার্গার বাটন ============ */}
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

          {/* ============ ৩. ডান পাশ: একশন লিংকস ও নোটিফিকেশন ============ */}
          <div className="header-right nav-actions flex items-center">
            {/* ডাইনামিক ডেস্কটপ মেনু */}
            <div className="desktop-menu-links desktop-only flex gap-4 mr-4 items-center font-semibold text-gray-700">
              {menuData.map((menu, index) =>
                menu.dropdown ? (
                  <div key={index} className="dropdown-wrapper relative">
                    <NavLink
                      to={menu.path}
                      className="nav-item hover:text-emerald-600 has-dropdown cursor-pointer"
                    >
                      {menu.name}{" "}
                      <i className="fa-solid fa-angle-down ms-1 text-sm"></i>
                    </NavLink>
                    <div className="dropdown-menu">
                      {menu.dropdown.map((sub, i) => (
                        <NavLink
                          key={i}
                          to={sub.path}
                          className="dropdown-link"
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={index}
                    to={menu.path}
                    className="nav-item hover:text-emerald-600"
                  >
                    {menu.name}
                  </NavLink>
                ),
              )}
            </div>

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

            {/* Auth Links (অপরিবর্তিত রাখা হয়েছে) */}
            {!auth.user ? (
              <div className="auth-links desktop-only ml-2">
                <NavLink
                  to="/login"
                  className="login-btn bg-emerald-600 text-white px-4 py-2 rounded-md"
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

            {/* নোটিফিকেশন বেল (অপরিবর্তিত রাখা হয়েছে) */}
            {auth?.user && (
              <div
                className="notification-wrapper"
                ref={notifRef}
                style={{
                  position: "relative",
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  onClick={handleNotifClick}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <FaBell size={24} color="#4b5563" />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        lineHeight: "1",
                        border: "2px solid #ffffff",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                {isNotifOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "160%",
                      right: "-10px",
                      width: "320px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "15px",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#1f2937",
                        }}
                      >
                        Notifications
                      </h3>
                    </div>
                    <div
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        padding: "10px",
                      }}
                    >
                      {notifications.length === 0 ? (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#6b7280",
                            margin: "20px 0",
                            fontSize: "14px",
                          }}
                        >
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((n, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setIsNotifOpen(false);
                              navigate(n.link);
                            }}
                            style={{
                              marginBottom: "10px",
                              padding: "12px",
                              backgroundColor: n.isRead ? "#ffffff" : "#f0f9ff",
                              border: "1px solid",
                              borderColor: n.isRead ? "#e5e7eb" : "#bae6fd",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "0.2s",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 5px 0",
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#111827",
                              }}
                            >
                              {n.title}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                color: "#4b5563",
                                lineHeight: "1.4",
                              }}
                            >
                              {n.message}
                            </p>
                            <span
                              style={{
                                display: "block",
                                marginTop: "8px",
                                fontSize: "11px",
                                color: "#9ca3af",
                              }}
                            >
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ৩. মোবাইল সাইডবার (Drawer) */}
      <div className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img
              src="/img/madrasatuz-zaytuna-logo.svg"
              alt="Logo"
              style={{ height: "45px", width: "auto" }}
            />
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Mobile Auth Section (অপরিবর্তিত রাখা হয়েছে) */}
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

          <p className="sidebar-label">Menu</p>

          {/* ডাইনামিক মোবাইল একর্ডিয়ন মেনু */}
          <div className="sidebar-category-list">
            {menuData.map((menu, index) => (
              <div key={index} className="mobile-menu-item-wrapper">
                {menu.dropdown ? (
                  <>
                    <div
                      className="sidebar-cat-link"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setOpenMobileDropdown(
                          openMobileDropdown === menu.name ? null : menu.name,
                        )
                      }
                    >
                      <span>{menu.name}</span>
                      <i
                        className={`fa-solid fa-chevron-${openMobileDropdown === menu.name ? "down" : "right"} arrow-icon`}
                      ></i>
                    </div>

                    {/* সাব-মেনু (অ্যাকর্ডিয়ন ওপেন হলে দেখাবে) */}
                    {openMobileDropdown === menu.name && (
                      <div
                        className="mobile-submenu"
                        style={{
                          paddingLeft: "1.5rem",
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          backgroundColor: "#f8fafc",
                          borderLeft: "2px solid #059669",
                          marginLeft: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        {menu.dropdown.map((sub, i) => (
                          <NavLink
                            key={i}
                            to={sub.path}
                            style={{
                              display: "block",
                              padding: "8px 0",
                              color: "#4b5563",
                              fontSize: "0.9rem",
                              textDecoration: "none",
                            }}
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={menu.path}
                    className="sidebar-cat-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{menu.name}</span>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
