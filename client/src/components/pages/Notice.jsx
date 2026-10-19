// src/components/pages/Notice.jsx

import React, { useState, useEffect } from "react";
import Layout from "./Layout"; // Layout এর সঠিক পাথ দিন
import axios from "axios";
import "./Notice.css";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // নোটিশ ফেচ করা
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await axios.get("/api/v1/notice/get-notices");
        if (data?.success) {
          // সাধারণ ইউজারদের জন্য শুধুমাত্র "Active" নোটিশগুলো ফিল্টার করা হলো
          const activeNotices = data.notices.filter(
            (notice) => notice.status === "Active",
          );
          setNotices(activeNotices);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // তারিখ সুন্দর ফরম্যাটে দেখানোর ফাংশন
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <Layout title={"Notice Board - Madrasatuz Zaytuna"}>
      <div className="notice-page-container">
        {/* পেজ হেডার */}
        <div className="notice-header-section">
          <h1>Notice Board</h1>
          <p className="notice-subtitle">
            Stay updated with the latest announcements, events, and holidays.
          </p>
        </div>

        {/* নোটিশ লিস্ট */}
        <div className="notice-list-wrapper">
          {loading ? (
            <div className="loading-spinner">
              <i className="fa-solid fa-spinner fa-spin"></i> Loading notices...
            </div>
          ) : notices.length === 0 ? (
            <div className="no-notice-msg">
              <i className="fa-regular fa-folder-open"></i> No notices available
              at the moment.
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice._id} className="notice-card">
                <div className="notice-date">
                  <i className="fa-regular fa-calendar-days"></i>{" "}
                  {formatDate(notice.createdAt)}
                </div>
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-desc">{notice.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notice;
