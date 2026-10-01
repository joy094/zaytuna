// src/components/AdminRoute/AdminOrders.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Layout from "../../components/pages/Layout";
import AdminMenu from "./AdminMenu";
import moment from "moment";
import { toast } from "react-toastify"; // নোটিফিকেশনের জন্য
import "./AdminOrder.css";

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // সব অর্ডার ডাটাবেস থেকে নিয়ে আসা
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/update-order-status/${orderId}`, {
        status: value,
      });
      getOrders(); // লিস্ট রিফ্রেশ করা
      toast.success("Order status updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  // === অর্ডার ডিলিট করার ফাংশন ===
  const handleDelete = async (orderId) => {
    try {
      // ডিলিট করার আগে কনফার্মেশন অ্যালার্ট
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      );
      if (!confirmDelete) return;

      const { data } = await axios.delete(
        `/api/v1/auth/delete-order/${orderId}`,
      );

      if (data?.success) {
        toast.success("Order deleted successfully");
        // রিয়েল-টাইম আপডেট: পেজ রিলোড না করেই অর্ডারটি লিস্ট থেকে সরিয়ে দেওয়া
        setOrders(orders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting order");
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="container dashboard-grid admin-orders-main">
        <div className="row mt-3">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="page-title text-center mb-4">Manage All Orders</h1>

            {orders?.map((o, i) => (
              <div className="order-wrapper border shadow mb-5" key={o._id}>
                <div className="table-responsive">
                  <table className="custom-table table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer/Guest</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Items</th>
                        <th>Action</th> {/* নতুন কলাম */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <select
                            className="status-select-dropdown"
                            onChange={(e) =>
                              handleChange(o._id, e.target.value)
                            }
                            defaultValue={o?.status}
                          >
                            {status.map((s, idx) => (
                              <option key={idx} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* নাম দেখানোর লজিক */}
                        <td>
                          {o?.buyer?.name ? (
                            <span className="user-name">
                              👤 {o?.buyer?.name} <small>(User)</small>
                            </span>
                          ) : (
                            <span className="guest-name">
                              🛒 {o?.guestDetails?.name} <small>(Guest)</small>
                            </span>
                          )}
                        </td>

                        {/* মোবাইল নম্বর */}
                        <td>
                          {o?.buyer?.phone ? (
                            <span>{o?.buyer?.phone}</span>
                          ) : (
                            <span>{o?.guestDetails?.phone || "N/A"}</span>
                          )}
                        </td>

                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>
                          <span className="payment-method">
                            {o?.paymentMethod || "COD"}
                          </span>
                        </td>
                        <td>{o?.products?.length}</td>

                        {/* ডিলিট বাটন */}
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(o._id)}
                            title="Delete Order"
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* অর্ডারের ভেতরে থাকা প্রোডাক্টগুলো */}
                <div className="admin-product-list p-3 bg-light">
                  {o?.products?.map((p, index) => (
                    <div
                      className="product-row d-flex align-items-center mb-2 border-bottom pb-2"
                      key={index}
                    >
                      <div className="product-img-box">
                        {/* ফিক্স করা হয়েছে: সরাসরি Cloudinary লিংক */}
                        <img
                          src={p.photo}
                          alt={p.name}
                          width="60px"
                          height="60px"
                          className="rounded shadow-sm"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="product-info-box ms-3">
                        <p className="mb-0 fw-bold">{p.name}</p>

                        {/* ভেরিয়েন্ট ইনফো */}
                        <div className="mt-1">
                          {p.selectedVariant ? (
                            <>
                              <span className="variant-badge">
                                🎨 {p.selectedVariant.color}
                              </span>
                              <span className="variant-badge ms-2">
                                💾 {p.selectedVariant.ram}/
                                {p.selectedVariant.storage}
                              </span>
                              <span className="variant-badge ms-2">
                                📍 {p.selectedVariant.region}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted small">
                              No variant selected
                            </span>
                          )}
                        </div>

                        <p className="mb-0 text-dark small mt-1">
                          <strong>Price:</strong> ৳ {p.price} |{" "}
                          <strong>Qty:</strong> 1
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* ডেলিভারি অ্যাড্রেস সেকশন */}
                  <div className="order-footer mt-3">
                    <p className="small mb-0">
                      <i className="fa fa-map-marker-alt text-danger me-2"></i>
                      <strong>Shipping To:</strong>{" "}
                      {o?.guestDetails?.address ||
                        o?.buyer?.address ||
                        "Address not provided"}
                    </p>
                    {o?.guestDetails?.note && (
                      <p className="small mb-0 text-muted mt-1">
                        <strong>Note:</strong> {o.guestDetails.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <h4 className="text-center mt-5">No orders found.</h4>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
