// src/components/AdminRoute/ManageNotices.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import "./ManageNotices.css";

const ManageNotices = () => {
  const [auth] = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  // নোটিশগুলো ব্যাকএন্ড থেকে ফেচ করা
  const fetchNotices = async () => {
    try {
      const { data } = await axios.get("/api/v1/notice/get-notices");
      if (data?.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // নোটিশ ডিলিট করার ফাংশন (Real DB Delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      const { data } = await axios.delete(`/api/v1/notice/delete/${id}`, {
        headers: { Authorization: auth?.token },
      });

      if (data?.success) {
        setNotices(notices.filter((n) => n._id !== id));
        toast.success(data.message || "Notice deleted successfully");
      } else {
        toast.error(data?.message || "Could not delete notice");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  // স্ট্যাটাস সরাসরি ড্রপডাউন থেকে পরিবর্তন করার ফাংশন (Real DB Update)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const targetNotice = notices.find((n) => n._id === id);
      const { data } = await axios.put(
        `/api/v1/notice/update-status/${id}`,
        {
          title: targetNotice.title,
          description: targetNotice.description,
          status: newStatus,
        },
        { headers: { Authorization: auth?.token } },
      );

      if (data?.success) {
        setNotices(
          notices.map((n) => (n._id === id ? { ...n, status: newStatus } : n)),
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  // এডিট মডাল ওপেন করা
  const handleEditClick = (notice) => {
    setEditingId(notice._id);
    setEditTitle(notice.title);
    setEditDescription(notice.description);
    setEditStatus(notice.status);
    setIsModalOpen(true);
  };

  // এডিট ফর্ম সাবমিট করা
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/notice/update-status/${editingId}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
        },
        { headers: { Authorization: auth?.token } },
      );

      if (data?.success) {
        toast.success("Notice updated successfully");
        setIsModalOpen(false);
        fetchNotices(); // আপডেট হওয়া ডেটা পুনরায় লোড করা
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notice");
    }
  };

  // তারিখ ফরম্যাট করা
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="manage-notices-container">
      <div className="manage-header">
        <h2>Manage Notices</h2>
        <p>
          View, edit, delete, or change the status of all published notices.
        </p>
      </div>

      <div className="notices-table-card">
        {loading ? (
          <div className="loading-state">
            <i className="fa-solid fa-spinner fa-spin"></i> Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="empty-state">
            <p>No notices found. Create one first!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td>{index + 1}</td>
                    <td className="notice-title-col">
                      <span className="title-text">{notice.title}</span>
                      <small className="desc-text">
                        {notice.description.substring(0, 40)}...
                      </small>
                    </td>
                    <td>{formatDate(notice.createdAt)}</td>
                    <td>
                      <select
                        className={`status-select ${notice.status.toLowerCase()}`}
                        value={notice.status}
                        onChange={(e) =>
                          handleStatusChange(notice._id, e.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </td>
                    <td className="action-btns">
                      <button
                        className="btn-edit"
                        title="Edit Notice"
                        onClick={() => handleEditClick(notice)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn-delete"
                        title="Delete"
                        onClick={() => handleDelete(notice._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= EDIT NOTICE MODAL ================= */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Notice</h3>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotices;
