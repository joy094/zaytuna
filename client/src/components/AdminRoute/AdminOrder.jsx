// src/components/AdminRoute/AdminOrder.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Layout from "../../components/pages/Layout";
import AdminMenu from "./AdminMenu";
import moment from "moment";
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
      const { data } = await axios.put(
        `/api/v1/auth/update-order-status/${orderId}`,
        { status: value },
      );
      getOrders(); // লিস্ট রিফ্রেশ করা
    } catch (error) {
      console.log(error);
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
                      </tr>
                    </thead>
                    {/* ... আগের কোড ... */}
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
                            {status.map((s, i) => (
                              <option key={i} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* নাম দেখানোর লজিক (User অথবা Guest) */}
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

                        {/* মোবাইল নম্বর দেখানোর লজিক */}
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
                      </tr>
                    </tbody>
                    {/* ... বাকি কোড ... */}
                  </table>
                </div>

                {/* অর্ডারের ভেতরে থাকা প্রোডাক্টগুলো */}
                <div className="admin-product-list p-3 bg-light">
                  {o?.products?.map((p) => (
                    <div
                      className="product-row d-flex align-items-center mb-2 border-bottom pb-2"
                      key={p._id}
                    >
                      <div className="product-img-box">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          width="60px"
                          height="60px"
                          className="rounded shadow-sm"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="product-info-box ms-3">
                        <p className="mb-0 fw-bold">{p.name}</p>
                        <p className="mb-0 text-muted small">
                          Price: ৳ {p.price}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* ডেলিভারি অ্যাড্রেস দেখার জন্য (গেস্টের ক্ষেত্রে খুব জরুরি) */}
                  <div className="order-footer mt-2">
                    <p className="small mb-0">
                      <strong>Delivery Address:</strong>{" "}
                      {o?.guestDetails?.address || "Registered User Address"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <h4 className="text-center">No orders found.</h4>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
