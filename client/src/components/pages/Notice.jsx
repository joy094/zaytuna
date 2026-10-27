// src/components/pages/Notice.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import "./Notice.css";

const Notice = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // 🔴 হেডার মেনু থেকে লিংকে ক্লিক করলে অটোমেটিক ট্যাব ফিল্টার হওয়ার লজিক
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
  // 🔴 Mock Data (পরবর্তীতে এটি API থেকে আসবে)
  // ==========================================
  const dummyNotices = [
    {
      _id: "1",
      title: "Eid Ul Ajhah Holidays",
      date: "October 19, 2026",
      category: "official",
      tag: "Official Notice",
      content:
        "The Madrasah will remain closed on the occasion of Eid Ul Ajhah. We wish all our students and their families a blessed Eid. Regular classes will resume as per the academic calendar.",
    },
    {
      _id: "2",
      title: "Mid-Term Examination Routine Published",
      date: "October 25, 2026",
      category: "academic",
      tag: "Academic Notice",
      content:
        "The mid-term examination routine for Play to Grade 5 has been published. Parents are requested to check the student portal for detailed subject-wise schedules.",
    },
    {
      _id: "3",
      title: "Hiring: Assistant Teacher (English)",
      date: "November 01, 2026",
      category: "career",
      tag: "Career",
      content:
        "Madrasatuz Zaytuna International is looking for a qualified English teacher. Applicants must have excellent command over the English language and prior teaching experience.",
    },
    {
      _id: "4",
      title: "Parent-Teacher Meeting for Grade 1",
      date: "November 05, 2026",
      category: "academic",
      tag: "Academic Notice",
      content:
        "A mandatory parent-teacher meeting will be held to discuss the academic progress of Grade 1 students. Please ensure your presence.",
    },
  ];

  // ফিল্টারিং লজিক
  const filteredNotices =
    activeTab === "all"
      ? dummyNotices
      : dummyNotices.filter((notice) => notice.category === activeTab);

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
            {filteredNotices.length > 0 ? (
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
