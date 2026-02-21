import React, { useEffect, useState } from "react";
import Layout from "../../components/pages/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import AdminMenu from "./AdminMenu";

// ৪. Admin Dashboard
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div
        className="container dashboard-grid"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        <AdminMenu />
        <div
          className="details-card"
          style={{ flex: 1, padding: "20px", border: "1px solid #ddd" }}
        >
          <h1>Admin Details</h1>
          <h3>Admin Name: {auth?.user?.name}</h3>
          <h3>Admin Email: {auth?.user?.email}</h3>
          <h3>Admin Phone: {auth?.user?.phone}</h3>
        </div>
      </div>
    </Layout>
  );
};


export default AdminDashboard;