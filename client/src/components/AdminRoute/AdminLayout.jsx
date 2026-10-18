// src/components/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import Layout from "../pages/Layout"; // আপনার Layout এর সঠিক পাথ দিন
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <Layout title="Admin Dashboard">
      <div className="admin-layout-wrapper">
        {/* বামপাশের সাইডবার বা মেনু */}
        <div className="admin-sidebar-section">
          <AdminMenu />
        </div>

        {/* ডানপাশের মূল কন্টেন্ট */}
        <div className="admin-content-section">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;