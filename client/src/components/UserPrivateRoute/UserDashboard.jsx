// src/components/UserPrivateRoute/Dashboard.jsx
import React from "react";
import Layout from "../../components/pages/Layout";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/auth";
import "./UserDashboard.css"; // CSS ফাইলটি ইমপোর্ট করুন

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"User Dashboard"}>
      <div className="container dashboard-grid">
        <UserMenu />
        <div className="content-area">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {auth?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="page-title">User Profile</h1>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Full Name</span>
                <span className="value">{auth?.user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email Address</span>
                <span className="value">{auth?.user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Shipping Address</span>
                <span className="value">
                  {auth?.user?.address || "No address provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
