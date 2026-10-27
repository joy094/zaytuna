// src/components/AdminRoute/CreateNotice.jsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./CreateNotice.css";

const CreateNotice = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("academic");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Active");

  // ক্যাটাগরি চেঞ্জ হলে অটোমেটিক একটি ট্যাগ সাজেস্ট করার জন্য (অপশনাল)
  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    if (selectedCat === "academic") setTag("Academic Notice");
    if (selectedCat === "official") setTag("Official Notice");
    if (selectedCat === "career") setTag("Career");
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔴 রাউটটি আপনার backend (noticeRoutes.js) এর সাথে হুবহু মিলতে হবে
      const { data } = await axios.post("/api/v1/notice/create-notice", {
        title,
        content,
        category,
        tag,
        date,
        status,
      });

      if (data?.success) {
        toast.success("Notice Published Successfully!");
        // ফর্ম ক্লিয়ার করা
        setTitle("");
        setContent("");
        setCategory("academic");
        setTag("");
        setDate("");
        setStatus("Active");
      } else {
        toast.error(data?.message || "Failed to publish notice");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="create-notice-container">
        {/* পেজ হেডার */}
        <div className="notice-page-header">
          <h2>Create New Notice</h2>
          <p>Publish a new announcement or notice for students and parents.</p>
        </div>

        {/* নোটিশ ফর্ম কার্ড */}
        <div className="notice-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Notice Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Eid-ul-Fitr Vacation 2027"
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="academic">Academic</option>
                  <option value="official">Official</option>
                  <option value="career">Career</option>
                </select>
              </div>

              <div className="form-group">
                <label>Badge / Tag</label>
                <input
                  type="text"
                  className="form-control"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Exam Routine"
                  required
                />
              </div>

              <div className="form-group">
                <label>Publish Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notice Description / Details</label>
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full notice details here..."
                rows="7"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active (Publish immediately)</option>
                <option value="Draft">Draft (Save for later)</option>
              </select>
            </div>

            <div className="form-actions mt-4">
              <button type="submit" className="btn-publish">
                Publish Notice <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNotice;
