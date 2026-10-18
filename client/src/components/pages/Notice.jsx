// src/components/AdminRoute/CreateNotice.jsx

import React, { useState } from "react";
import Layout from "./Layout"; // Layout ইমপোর্ট করা হলো
import { toast } from "react-toastify";
// import axios from "axios"; // ব্যাকএন্ড কানেক্ট করার সময় এটি আনকমেন্ট করবেন
import "./Notice.css";

const CreateNotice = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔴 পরে এখানে ডাটাবেজে ডাটা পাঠানোর জন্য axios.post ব্যবহার করবেন
      // const res = await axios.post("/api/v1/notice/create", { title, description, status });

      // ডেমো সাকসেস মেসেজ
      toast.success("Notice Published Successfully!");

      // ফর্ম ক্লিয়ার করা
      setTitle("");
      setDescription("");
      setStatus("Active");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Create Notice - Admin Panel"}>
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

            <div className="form-group">
              <label>Notice Description / Details</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
    </Layout>
  );
};

export default CreateNotice;
