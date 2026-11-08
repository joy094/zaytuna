// src/components/pages/Admin/ManageApplications.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import { useReactToPrint } from "react-to-print"; // 🔴 Print করার জন্য লাইব্রেরি (npm install react-to-print করতে হবে)

import "./ManageApplication.css";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [auth] = useAuth();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // 🔴 Print Reference (ভেতরে null দিন)
  const printRef = useRef(null);

  // 🔴 নতুন ভার্সনের নিয়ম অনুযায়ী contentRef ব্যবহার করা হয়েছে
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedApp
      ? `Application_${selectedApp.applicationId}`
      : "Application_Form",
  });

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

  // handle delete ফ্রন্টএন্ডে ফাংশনটি যুক্ত করুন
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (confirmDelete) {
      try {
        const { data } = await axios.delete(
          `/api/v1/admission/delete-application/${id}`,
          {
            headers: { Authorization: auth?.token }, // যদি টোকেন লাগে
          },
        );

        if (data.success) {
          toast.success(data.message);
          // স্টেট আপডেট করে ডিলিট হওয়া আইটেমটি লিস্ট থেকে সরিয়ে দিন
          setApplications(applications.filter((app) => app._id !== id));
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while deleting");
      }
    }
  };

  const filteredApplications = applications.filter((app) => {
    const childName = app.childInfo?.fullName?.toLowerCase() || "";
    const appId = app.applicationId?.toLowerCase() || "";
    const email = app.familyInfo?.email?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      childName.includes(searchLower) ||
      appId.includes(searchLower) ||
      email.includes(searchLower);

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

          {/* Search and Filter Section */}
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
              placeholder="Search by Application ID, Name or Email..."
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
                  <th>SL</th>
                  <th>Child Name & Application ID</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Status</th>
                  {/* 🔴 ১. এখানে Date & Time হেডার যুক্ত করা হলো */}
                  <th>Date & Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* 🔴 এখানে ডেটাগুলোকে সর্ট করে নেওয়া হচ্ছে (পুরোনো বা প্রথম আবেদন আগে আসবে) */}
                {[...filteredApplications]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((app, index) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
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

                      {/* 🔴 ২. এখানে Date & Time এর ডেটা রেন্ডার করা হলো (Status ও Action এর মাঝে) */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              color: "#374151",
                            }}
                          >
                            {new Date(app.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "#6b7280",
                              fontWeight: "500",
                            }}
                          >
                            <i
                              className="fa-regular fa-clock"
                              style={{ marginRight: "4px" }}
                            ></i>
                            {new Date(app.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Action কলাম */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            className="btn-view"
                            style={{
                              padding: "6px 14px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              fontWeight: "500",
                              border: "none",
                            }}
                            onClick={() => setSelectedApp(app)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            style={{
                              backgroundColor: "#ef4444",
                              color: "white",
                              padding: "6px 14px",
                              borderRadius: "5px",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontWeight: "500",
                            }}
                            onClick={() => handleDelete(app._id)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td
                      colSpan="8" // 🔴 ৩. যেহেতু নতুন একটি কলাম যুক্ত হয়েছে, তাই colSpan 7 থেকে 8 করে দেওয়া হলো
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

          {/* 🔴 Full Detail & Printable Modal */}
          {selectedApp && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: "850px" }}>
                {/* Modal Header with Print & Close Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid #e2e8f0",
                    paddingBottom: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#059669" }}>
                    <i className="fa-solid fa-file-lines"></i> Pre-Admission
                    Form Details
                  </h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handlePrint}
                      style={{
                        backgroundColor: "#0284c7",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="fa-solid fa-print"></i> Print Form
                    </button>
                    <button
                      onClick={() => setSelectedApp(null)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i> Close
                    </button>
                  </div>
                </div>

                {/* 🔴 Printable Area Starts Here */}
                <div ref={printRef} className="adm-print-container">
                  <div
                    className="adm-print-header"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px auto 140px",
                      alignItems: "center", // একসাথে লম্বালম্বি মাঝে রাখা
                      borderBottom: "2px solid #059669",
                      paddingBottom: "15px", // নিচে হালকা প্যাডিং বাড়ানো হলো
                      marginBottom: "15px",
                      width: "100%",
                    }}
                  >
                    {/* 🔴 ১. বাম পাশে: লোগো (একটু নিচে নামানোর জন্য marginTop বা প্যাডিং দেওয়া যেতে পারে) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        paddingTop: "5px",
                      }}
                    >
                      <img
                        src="/img/madrasatuz-zaytuna-logo5.png"
                        alt="Logo"
                        style={{ width: "110px", height: "auto" }} // লোগোর সাইজ আরেকটু সুন্দর করা হলো
                      />
                    </div>

                    {/* 🔴 ২. মাঝখানে: টাইটেল */}
                    <div style={{ textAlign: "center", padding: "0 10px" }}>
                      <h2
                        style={{
                          margin: "0",
                          color: "#064e3b",
                          fontSize: "20px",
                        }}
                      >
                        Madrasatuz Zaytuna International
                      </h2>
                      <h4
                        style={{
                          margin: "5px 0 0 0",
                          color: "#374151",
                          textTransform: "uppercase",
                          fontSize: "13px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        PRE-ADMISSION APPLICATION FORM <br />
                        SESSION 2027
                      </h4>
                    </div>

                    {/* 🔴 ৩. ডান পাশে: স্কোর এবং অ্যাপ আইডি (একটু নিচে নামানোর জন্য paddingTop দেওয়া হলো) */}
                    <div
                      className="adm-print-meta"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                        paddingTop: "35px", // মাদরাসার নামের সোজাসুজি মিল রাখার জন্য সামান্য নিচে নামানো হলো
                      }}
                    >
                      <div
                        className="adm-print-badge"
                        style={{
                          color: "#059669",
                          borderColor: "#059669",
                          margin: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Score: {selectedApp.score}/100
                      </div>
                      <div
                        className="adm-print-badge"
                        style={{ margin: 0, whiteSpace: "nowrap" }}
                      >
                        App ID: {selectedApp.applicationId}
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Child Info */}
                  <div className="adm-print-section-title">
                    1. About Your Child
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Child's Name:</div>
                        <div className="adm-print-value">
                          {selectedApp.childInfo?.fullName}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Date of Birth:</div>
                        <div className="adm-print-value">
                          {new Date(
                            selectedApp.childInfo?.dob,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Gender:</div>
                        <div className="adm-print-value">
                          {selectedApp.childInfo?.gender}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Class Sought:</div>
                        <div className="adm-print-value">
                          {selectedApp.childInfo?.classSought}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Current School:</div>
                        <div className="adm-print-value">
                          {selectedApp.childInfo?.currentSchool || "None"}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Qur'an Level:</div>
                        <div className="adm-print-value">
                          {selectedApp.childInfo?.quranLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="adm-print-field">
                    <div className="adm-print-label">Support Needed:</div>
                    <div className="adm-print-value">
                      {selectedApp.childInfo?.supportNeeded || "None"}
                    </div>
                  </div>

                  {/* Section 2: Family Info */}
                  <div className="adm-print-section-title">
                    2. Family Information
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Father's Name:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.fatherName}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Father's Job:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.fatherOccupation}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Lives With:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.livesWith}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Residence Area:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.areaOfResidence}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Mother's Name:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.motherName}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Mother's Job:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.motherOccupation}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Primary Mobile:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.primaryMobile}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Family Email:</div>
                        <div className="adm-print-value">
                          {selectedApp.familyInfo?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Deen in the Family */}
                  <div className="adm-print-section-title">
                    3. Deen in the Family
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Father's Prayer:</div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.fatherPrayer}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Mother's Prayer:</div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.motherPrayer}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">
                          Qur'an Recitation:
                        </div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.quranRecitation}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Fasting & Zakat:</div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.fastingAndZakat}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Islamic Dress:</div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.islamicDress}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Islamic Learning:</div>
                        <div className="adm-print-value">
                          {selectedApp.deenInfo?.islamicLearning}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Home & Livelihood */}
                  <div className="adm-print-section-title">
                    4. Home & Livelihood
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Income Source:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.incomeSource}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Work Description:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.workDescription}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">
                          Riba / Prohibited:
                        </div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.ribaOrProhibited}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Television:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.television}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Music Played:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.music}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Observes Purdah:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.purdah}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Meals Together:</div>
                        <div className="adm-print-value">
                          {selectedApp.homeInfo?.mealsTogether}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Child's Habits & Conduct */}
                  <div className="adm-print-section-title">
                    5. Child's Habits & Conduct
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Screen Time:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.screenTime}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Own Device:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.ownDevice}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Video Games:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.videoGames}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Watch TV/YouTube:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.watchTV}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Usual Bedtime:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.bedtime}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Obeys Parents:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.conduct?.obeysParents}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Tantrums/Anger:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.conduct?.tantrums}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Bad Words:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.conduct?.badWords}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Shares Kindly:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.conduct?.sharesKindly}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Interest in Deen:</div>
                        <div className="adm-print-value">
                          {selectedApp.habitsInfo?.conduct?.showsInterestInDeen}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Commitment */}
                  <div className="adm-print-section-title">
                    6. Commitment & Declaration
                  </div>
                  <div className="adm-print-field">
                    <div className="adm-print-label long">
                      Main Hope at Zaytuna:
                    </div>
                    <div className="adm-print-value">
                      {selectedApp.commitmentInfo?.mainHope}
                    </div>
                  </div>
                  <div className="adm-print-field">
                    <div className="adm-print-label long">
                      Parent goes over Qur'an:
                    </div>
                    <div className="adm-print-value">
                      {selectedApp.commitmentInfo?.parentGoOverQuran}
                    </div>
                  </div>
                  <div className="adm-print-field">
                    <div
                      className="adm-print-label long"
                      style={{ width: "100%" }}
                    >
                      About Family & Why Zaytuna:
                    </div>
                  </div>
                  <div className="adm-print-desc-box">
                    {selectedApp.commitmentInfo?.familyDescription}
                  </div>

                  <div className="adm-print-signature-block">
                    <div className="adm-print-sign-area">
                      <div className="adm-print-sign-line">
                        {new Date(selectedApp.appliedAt).toLocaleDateString()}
                      </div>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Date of Submission
                      </span>
                    </div>
                    <div className="adm-print-sign-area">
                      <div className="adm-print-sign-line">
                        {selectedApp.commitmentInfo?.guardianSignature}
                      </div>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Guardian's Signature
                      </span>
                    </div>
                  </div>
                </div>
                {/* 🔴 Printable Area Ends Here */}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
