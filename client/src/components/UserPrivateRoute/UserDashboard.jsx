// src/components/UserPrivateRoute/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Layout from "../../components/pages/Layout";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import "./UserDashboard.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.token) {
      fetchMyApplications();
    }
  }, [auth?.token]);

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get("/api/v1/admission/my-applications", {
        headers: { Authorization: auth?.token },
      });
      if (res.data.success) {
        setMyApps(res.data.applications);
      }
    } catch (error) {
      console.log("No applications found or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#fef3c7", text: "#b45309" };
      case "Invite to Interview":
        return { bg: "#dbeafe", text: "#1d4ed8" };
      case "Accepted":
        return { bg: "#dcfce7", text: "#15803d" };
      case "Hold":
        return { bg: "#ffedd5", text: "#c2410c" };
      case "Cancelled":
        return { bg: "#fee2e2", text: "#b91c1c" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  return (
    <Layout title={"User Dashboard"}>
      <div className="container dashboard-grid">
        <UserMenu />

        <div className="content-area">
          {/* User Profile Section */}
          <div className="profile-card" style={{ marginBottom: "25px" }}>
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
                <span className="label">Address</span>
                <span className="value">
                  {auth?.user?.address || "No address provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Application Status Section */}
          <div className="profile-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
                marginBottom: "20px",
              }}
            >
              <h2
                className="page-title"
                style={{ fontSize: "20px", margin: 0 }}
              >
                My Applications ({myApps.length})
              </h2>
            </div>

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading application status...</p>
            ) : myApps.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                You haven't submitted any applications yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {myApps.map((app, index) => (
                  <div
                    key={app._id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "20px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    {/* Header (Name, App ID & Status) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "10px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        >
                          Applicant {index + 1}
                          {/* 🔴 অ্যাপ্লিকেশন আইডি এখানে যুক্ত করা হয়েছে */}
                          {app.applicationId && (
                            <span
                              style={{ color: "#4d7c0f", marginLeft: "8px" }}
                            >
                              | REF: {app.applicationId}
                            </span>
                          )}
                        </span>
                        <h3
                          style={{
                            fontSize: "18px",
                            margin: "2px 0 0 0",
                            color: "#111827",
                            fontWeight: "bold",
                          }}
                        >
                          {app.childInfo?.fullName}
                        </h3>
                      </div>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          fontSize: "13px",
                          backgroundColor: getStatusColor(app.status).bg,
                          color: getStatusColor(app.status).text,
                        }}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Basic Info Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        fontSize: "14px",
                        color: "#4b5563",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#374151" }}>
                          Class Sought:
                        </strong>{" "}
                        {app.childInfo?.classSought}
                      </div>
                      <div>
                        <strong style={{ color: "#374151" }}>
                          Submission Date:
                        </strong>{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <strong style={{ color: "#374151" }}>
                          Father's Name:
                        </strong>{" "}
                        {app.familyInfo?.fatherName}
                      </div>
                      <div>
                        <strong style={{ color: "#374151" }}>Mobile:</strong>{" "}
                        {app.familyInfo?.primaryMobile}
                      </div>
                    </div>

                    {/* Conditional Message for Interview */}
                    {app.status === "Invite to Interview" && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "12px 15px",
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "6px",
                          color: "#166534",
                          fontSize: "14px",
                        }}
                      >
                        <strong>🎉 Congratulations!</strong> This application
                        has been reviewed and we would like to invite you for an
                        interview. Our office will contact you soon with the
                        schedule.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
