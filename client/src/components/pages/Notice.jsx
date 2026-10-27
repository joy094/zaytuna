// src/components/pages/Notice.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import "./Notice.css";

const Notice = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // 🔴 ব্যাকএন্ড থেকে ডেটা রাখার জন্য নতুন State
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // হেডার মেনু থেকে লিংকে ক্লিক করলে অটোমেটিক ট্যাব ফিল্টার হওয়ার লজিক
  useEffect(() => {
    if (location.hash === "#career") {
      setActiveTab("career");
    } else if (location.hash === "#academic") {
      setActiveTab("academic");
    } else if (location.hash === "#official") {
      setActiveTab("official");
    } else {
      setActiveTab("all");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  // ==========================================
  // 🔴 API থেকে ডাটাবেসের নোটিশ ফেচ করার ফাংশন
  // ==========================================
  const fetchNotices = async () => {
    try {
      setLoading(true);
      // আপনার রাউটের সাথে URL মিলিয়ে নেবেন (উদাঃ /api/v1/notice/get-notices)
      const { data } = await axios.get("/api/v1/notice/get-notices");
      if (data?.success) {
        // শুধুমাত্র 'Active' স্ট্যাটাসের নোটিশগুলো ফ্রন্টএন্ডে দেখানোর জন্য ফিল্টার করা হলো
        const activeNotices = data.notices.filter((n) => n.status === "Active");
        setNotices(activeNotices);
      }
    } catch (error) {
      console.log("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ট্যাবের ওপর ভিত্তি করে ফিল্টারিং লজিক (API ডাটার ওপর কাজ করবে)
  const filteredNotices =
    activeTab === "all"
      ? notices
      : notices.filter((notice) => notice.category === activeTab);

  return (
    <Layout title={"Notice Board - Madrasatuz Zaytuna International"}>
      <section className="notice-page-wrapper">
        <div className="notice-container">
          {/* Header Section */}
          <div className="notice-header text-center">
            <h1 className="notice-title">Notice Board</h1>
            <p className="notice-subtitle">
              Stay updated with the latest announcements, events, and holidays.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="notice-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Notices
            </button>
            <button
              className={`tab-btn ${activeTab === "academic" ? "active" : ""}`}
              onClick={() => setActiveTab("academic")}
            >
              Academic Notice
            </button>
            <button
              className={`tab-btn ${activeTab === "official" ? "active" : ""}`}
              onClick={() => setActiveTab("official")}
            >
              Official Notice
            </button>
            <button
              className={`tab-btn ${activeTab === "career" ? "active" : ""}`}
              onClick={() => setActiveTab("career")}
            >
              Career
            </button>
          </div>

          {/* Notice List */}
          <div className="notice-list">
            {loading ? (
              <div className="text-center py-5">
                <h4 style={{ color: "#059669" }}>Loading notices...</h4>
              </div>
            ) : filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div key={notice._id} className="notice-card">
                  <div className="notice-card-header">
                    <span className="notice-date">
                      <i className="fa-regular fa-calendar me-1"></i>{" "}
                      {notice.date}
                    </span>
                    <span className={`notice-badge ${notice.category}`}>
                      {notice.tag}
                    </span>
                  </div>
                  <h3 className="notice-item-title">{notice.title}</h3>
                  <p className="notice-content">{notice.content}</p>
                </div>
              ))
            ) : (
              <div className="no-notice-msg">
                <i className="fa-regular fa-folder-open"></i>
                <p>No notices available in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Notice;
