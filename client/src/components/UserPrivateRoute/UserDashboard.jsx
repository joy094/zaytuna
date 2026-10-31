// src/components/UserPrivateRoute/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Layout from "../../components/pages/Layout";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import "./UserDashboard.css";
// 🔴 Final Admission Form টি ইমপোর্ট করা হলো (পাথ ঠিক আছে কি না চেক করে নেবেন)
import FinalAdmissionForm from "./FinalAdmissionForm";

const Dashboard = () => {
  const [auth] = useAuth();
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 নতুন ফর্ম ওপেন করার স্টেট
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

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
          {/* =========================================================
              🔴 যদি showFinalForm true হয়, তাহলে শুধু ফর্মটি দেখাবে
          ========================================================= */}
          {showFinalForm ? (
            <div>
              <button
                onClick={() => setShowFinalForm(false)}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  padding: "8px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "20px",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
              </button>

              <FinalAdmissionForm
                onNavigate={() => setShowFinalForm(false)}
                userPreData={{
                  studentName: selectedApp?.childInfo?.fullName,
                  applyingClass: selectedApp?.childInfo?.classSought,
                  fatherMobile: selectedApp?.familyInfo?.primaryMobile,
                  email: selectedApp?.familyInfo?.email,
                  dob: selectedApp?.childInfo?.dob
                    ? selectedApp.childInfo.dob.split("T")[0]
                    : "",
                }}
              />
            </div>
          ) : (
            /* =========================================================
                রেগুলার ড্যাশবোর্ড ভিউ
            ========================================================= */
            <>
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
                  <p style={{ color: "#6b7280" }}>
                    Loading application status...
                  </p>
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
                              {app.applicationId && (
                                <span
                                  style={{
                                    color: "#4d7c0f",
                                    marginLeft: "8px",
                                  }}
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
                            <strong style={{ color: "#374151" }}>
                              Mobile:
                            </strong>{" "}
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
                            <strong>🎉 Congratulations!</strong> This
                            application has been reviewed and we would like to
                            invite you for an interview. Our office will contact
                            you soon with the schedule.
                          </div>
                        )}

                        {/* 🔴 Conditional Message for ACCEPTED (Final Admission) */}
                        {app.status === "Accepted" && (
                          <div
                            style={{
                              marginTop: "15px",
                              padding: "20px",
                              backgroundColor: "#ecfdf5",
                              border: "1px solid #a7f3d0",
                              borderRadius: "8px",
                              color: "#064e3b",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 10px 0",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              <i className="fa-solid fa-circle-check me-2"></i>
                              Application Approved!
                            </h4>
                            <p
                              style={{ margin: "0 0 15px 0", fontSize: "14px" }}
                            >
                              Your application is approved. An email with a
                              highly confidential <strong>Offer Code</strong>{" "}
                              has been sent to your registered email address.
                              You must complete the final admission form to
                              secure the seat.
                            </p>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setShowFinalForm(true);
                              }}
                              style={{
                                background: "#059669",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.background = "#047857")
                              }
                              onMouseOut={(e) =>
                                (e.target.style.background = "#059669")
                              }
                            >
                              Complete Final Admission{" "}
                              <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
