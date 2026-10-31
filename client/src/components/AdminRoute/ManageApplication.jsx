// src/components/pages/Admin/ManageApplications.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

import "./ManageApplication.css";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [auth] = useAuth();

  // 🔴 নতুন State: Search & Filter এর জন্য
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/v1/admission/all-applications", {
        headers: { Authorization: auth?.token },
      });
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (error) {
      toast.error("Failed to load applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await axios.put(
        `/api/v1/admission/update-status/${appId}`,
        { status: newStatus },
        { headers: { Authorization: auth?.token } },
      );
      if (res.data.success) {
        toast.success("Status updated successfully!");
        fetchApplications();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  // 🔴 Search এবং Filter লজিক
  const filteredApplications = applications.filter((app) => {
    // Search Matching
    const childName = app.childInfo?.fullName?.toLowerCase() || "";
    const appId = app.applicationId?.toLowerCase() || "";
    const email = app.familyInfo?.email?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      childName.includes(searchLower) ||
      appId.includes(searchLower) ||
      email.includes(searchLower);

    // Filter Matching
    let matchesFilter = true;
    if (filterStatus === "Final Phase") {
      matchesFilter = ["Under Review", "Admitted", "Rejected"].includes(
        app.status,
      );
    } else if (filterStatus !== "All") {
      matchesFilter = app.status === filterStatus;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <section className="page">
        <div className="wrap manage-app-container">
          <h2 className="page-title">Manage Applications</h2>

          {/* 🔴 Search and Filter Section */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
              backgroundColor: "#f9fafb",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <input
              type="text"
              placeholder="Search by ID, Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: "1",
                padding: "10px 15px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                minWidth: "250px",
                outline: "none",
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "10px 15px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                minWidth: "200px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending</option>
              <option value="Invite to Interview">Invite to Interview</option>
              <option value="Hold">Hold</option>
              <option value="Accepted">Accepted (Offer Sent)</option>
              <option value="Final Phase">
                Final Phase (Review/Admitted/Rejected)
              </option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>SL</th> {/* 🔴 Serial Number Header */}
                  <th>Child Name & ID</th>
                  <th>Email</th> {/* 🔴 Email Header */}
                  <th>Class</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* 🔴 applications.map এর বদলে filteredApplications.map ব্যবহার করা হয়েছে */}
                {filteredApplications.map((app, index) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>{" "}
                    {/* 🔴 Serial Number */}
                    <td className="child-name">
                      {app.childInfo?.fullName}
                      {app.applicationId && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            fontWeight: "normal",
                          }}
                        >
                          {app.applicationId}
                        </div>
                      )}
                    </td>
                    {/* 🔴 Email Column */}
                    <td>
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        {app.familyInfo?.email || "N/A"}
                      </span>
                    </td>
                    <td>{app.childInfo?.classSought}</td>
                    <td>
                      <span
                        className={`score-badge ${app.score >= 70 ? "score-high" : "score-low"}`}
                      >
                        {app.score} / 100
                      </span>
                    </td>
                    <td>
                      {["Under Review", "Admitted", "Rejected"].includes(
                        app.status,
                      ) ? (
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#fff",
                            backgroundColor:
                              app.status === "Admitted"
                                ? "#10b981"
                                : app.status === "Rejected"
                                  ? "#ef4444"
                                  : "#f59e0b",
                            display: "inline-block",
                          }}
                        >
                          {app.status} (Final)
                        </span>
                      ) : (
                        <select
                          className="status-select"
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Invite to Interview">
                            Invite to Interview
                          </option>
                          <option value="Hold">Hold</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedApp(app)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#6b7280",
                      }}
                    >
                      No applications found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Document View Modal */}
          {selectedApp && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  className="btn-close"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>

                <h3 className="modal-header">Application Details</h3>

                <div className="modal-grid">
                  <div className="modal-section">
                    <h4>Child Information</h4>
                    <p>
                      <strong>Name:</strong> {selectedApp.childInfo?.fullName}
                    </p>
                    <p>
                      <strong>DOB:</strong>{" "}
                      {new Date(
                        selectedApp.childInfo?.dob,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Class:</strong>{" "}
                      {selectedApp.childInfo?.classSought}
                    </p>
                    <p>
                      <strong>Quran Level:</strong>{" "}
                      {selectedApp.childInfo?.quranLevel}
                    </p>
                    <p>
                      <strong>Support Needed:</strong>{" "}
                      {selectedApp.childInfo?.supportNeeded || "None"}
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Family Information</h4>
                    <p>
                      <strong>Father:</strong>{" "}
                      {selectedApp.familyInfo?.fatherName} (
                      {selectedApp.familyInfo?.fatherOccupation})
                    </p>
                    <p>
                      <strong>Mother:</strong>{" "}
                      {selectedApp.familyInfo?.motherName} (
                      {selectedApp.familyInfo?.motherOccupation})
                    </p>
                    <p>
                      <strong>Mobile:</strong>{" "}
                      {selectedApp.familyInfo?.primaryMobile}
                    </p>
                    <p>
                      <strong>Income Source:</strong>{" "}
                      {selectedApp.homeInfo?.incomeSource}
                    </p>
                  </div>

                  <div className="modal-section full-width">
                    <h4>Deen & Habits Summary</h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <p>
                          <strong>Father's Prayer:</strong>{" "}
                          {selectedApp.deenInfo?.fatherPrayer}
                        </p>
                        <p>
                          <strong>Mother's Prayer:</strong>{" "}
                          {selectedApp.deenInfo?.motherPrayer}
                        </p>
                        <p>
                          <strong>Qur'an Recitation:</strong>{" "}
                          {selectedApp.deenInfo?.quranRecitation}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Screen Time:</strong>{" "}
                          {selectedApp.habitsInfo?.screenTime}
                        </p>
                        <p>
                          <strong>Conduct (Obeys Parents):</strong>{" "}
                          {selectedApp.habitsInfo?.conduct?.obeysParents}
                        </p>
                        <p>
                          <strong>TV/Music in Home:</strong>{" "}
                          {selectedApp.homeInfo?.television} /{" "}
                          {selectedApp.homeInfo?.music}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section full-width">
                    <h4>Commitment & Reasoning</h4>
                    <p>
                      <strong>Main Hope:</strong>{" "}
                      {selectedApp.commitmentInfo?.mainHope}
                    </p>
                    <p>
                      <strong>Why Zaytuna:</strong>{" "}
                      {selectedApp.commitmentInfo?.familyDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
