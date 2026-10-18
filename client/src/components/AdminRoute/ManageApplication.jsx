// src/components/pages/Admin/ManageApplications.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import Layout from "../pages/Layout";
import "./ManageApplication.css"; // CSS ফাইলটি ইমপোর্ট করা হলো

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [auth] = useAuth();

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

  return (
    <Layout title="Manage Applications - Admin Dashboard">
      <section className="page">
        <div className="wrap manage-app-container">
          <h2 className="page-title">Manage Applications</h2>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Child Name</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="child-name">
                      {app.childInfo?.fullName}
                      {/* 🔴 অ্যাডমিন টেবিলে আইডি */}
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
                    <td>{app.childInfo?.classSought}</td>
                    <td>
                      <span
                        className={`score-badge ${app.score >= 70 ? "score-high" : "score-low"}`}
                      >
                        {app.score} / 100
                      </span>
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedApp(app)}
                      >
                        View Document
                      </button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6b7280",
                      }}
                    >
                      No applications found.
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
    </Layout>
  );
}
