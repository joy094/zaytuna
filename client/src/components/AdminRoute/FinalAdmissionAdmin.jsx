import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print"; // 🔴 Print Library
import "./FinalAdmissionAdmin.css";

export default function FinalAdmissionAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // 🔴 Vite Env থেকে URL নেওয়া
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

  // 🔴 Print Reference Setup
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedApp
      ? `Final_Admission_${selectedApp.applicationId}`
      : "Final_Admission_Form",
  });

  const fetchFinalApplications = async () => {
    try {
      const { data } = await axios.get("/api/v1/admission/final-applications");
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinalApplications();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admission/finalize-status/${id}`,
        { status: newStatus },
      );
      if (data.success) {
        toast.success(data.message);
        setSelectedApp(null);
        fetchFinalApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const getFileLink = (filePath) => {
    if (!filePath) return null;
    const normalizedPath = filePath.replace(/\\/g, "/");
    return BACKEND_URL + normalizedPath;
  };

  return (
    <div className="adm-container">
      <h2 className="adm-heading">
        <i className="fa-solid fa-folder-open"></i> Document Verification &
        Final Admissions
      </h2>

      <div className="adm-card">
        <div className="adm-table-responsive">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-muted">
                    No final applications found for verification.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td className="fw-bold text-primary">
                      {app.applicationId}
                    </td>
                    <td>{app.studentName || app.childInfo?.fullName}</td>
                    <td>{app.applyingClass}</td>
                    <td>{app.fatherMobile || app.familyInfo?.fatherMobile}</td>
                    <td>
                      <span
                        className={`adm-badge ${
                          app.status === "Admitted"
                            ? "adm-badge-success"
                            : app.status === "Rejected"
                              ? "adm-badge-danger"
                              : "adm-badge-warning"
                        }`}
                      >
                        {app.status || "Under Review"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedApp(app)}
                      >
                        <i className="fa-solid fa-eye"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {selectedApp && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-content" style={{ maxWidth: "850px" }}>
            {/* Modal Header with Print & Close Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #e2e8f0",
                padding: "20px 24px",
                backgroundColor: "#f8fafc",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h3 style={{ margin: 0, color: "#059669", fontSize: "1.25rem" }}>
                <i className="fa-solid fa-file-signature"></i> Final Admission
                Form
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

            <div className="adm-modal-body" style={{ padding: "0" }}>
              {/* 🔴 Printable Area Starts Here */}
              <div
                className="adm-modal-body"
                ref={printRef}
                style={{ padding: "0" }}
              >
                <div className="adm-print-container">
                  {/* Print Header: Madrasa Name & Passport Photo */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "2px solid #059669",
                      paddingBottom: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* 🔴 লেখাকে পারফেক্ট সেন্টারে রাখার জন্য বামপাশে একটি অদৃশ্য ব্যালেন্সিং স্পেস */}
                    <div style={{ width: "120px", flexShrink: 0 }}></div>

                    {/* 🔴 মাঝখানের লেখাগুলো (Centered Text) */}
                    <div
                      style={{
                        textAlign: "center",
                        flex: 1,
                        padding: "0 10px",
                      }}
                    >
                      <h2
                        style={{
                          color: "#059669",
                          margin: "0 0 5px 0",
                          fontSize: "24px",
                          fontWeight: "800",
                        }}
                      >
                        Madrasatuz Zaytuna International
                      </h2>
                      <h4
                        style={{
                          margin: "0 0 10px 0",
                          color: "#334155",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Final Admission Form — Session 2027
                      </h4>
                      <div
                        style={{
                          display: "inline-flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <div className="adm-print-badge">
                          App ID: {selectedApp.applicationId}
                        </div>
                        <div
                          className="adm-print-badge"
                          style={{
                            color:
                              selectedApp.status === "Admitted"
                                ? "#10b981"
                                : "#f59e0b",
                            borderColor:
                              selectedApp.status === "Admitted"
                                ? "#10b981"
                                : "#f59e0b",
                          }}
                        >
                          Status: {selectedApp.status || "Under Review"}
                        </div>
                      </div>
                    </div>

                    {/* 🔴 Passport Size Photo Box (Top Right) */}
                    <div
                      style={{
                        width: "120px",
                        height: "140px",
                        border: "2px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "4px",
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {selectedApp.photoFile ? (
                        <img
                          src={getFileLink(selectedApp.photoFile)}
                          alt="Student"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            textAlign: "center",
                          }}
                        >
                          PP Size
                          <br />
                          Photo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 1: Student Info */}
                  <div className="adm-print-section-title">
                    1. Student Information
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Student Name:</div>
                        <div className="adm-print-value">
                          {selectedApp.studentName}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Date of Birth:</div>
                        <div className="adm-print-value">{selectedApp.dob}</div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Applying Class:</div>
                        <div className="adm-print-value">
                          {selectedApp.applyingClass}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Session:</div>
                        <div className="adm-print-value">
                          {selectedApp.session}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Family Info */}
                  <div className="adm-print-section-title">
                    2. Guardian Information
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Father's Mobile:</div>
                        <div className="adm-print-value">
                          {selectedApp.fatherMobile}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Mother's Mobile:</div>
                        <div className="adm-print-value">
                          {selectedApp.motherMobile}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Email Address:</div>
                        <div className="adm-print-value">
                          {selectedApp.email}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div className="adm-print-label">Father's NID:</div>
                        <div className="adm-print-value">
                          {selectedApp.fatherNid}
                        </div>
                      </div>
                      <div className="adm-print-field">
                        <div className="adm-print-label">Mother's NID:</div>
                        <div className="adm-print-value">
                          {selectedApp.motherNid}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Documents Checklist */}
                  <div className="adm-print-section-title">
                    3. Documents Verification Checklist
                  </div>
                  <div className="adm-print-grid-2">
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div
                          className="adm-print-label long"
                          style={{ width: "200px" }}
                        >
                          Father's NID Copy:
                        </div>
                        <div
                          className="adm-print-value"
                          style={{ border: "none", fontWeight: "bold" }}
                        >
                          {selectedApp.fatherNidFile
                            ? "[ ✔ ] Submitted"
                            : "[   ] Missing"}
                        </div>
                      </div>
                    </div>
                    <div className="adm-print-col">
                      <div className="adm-print-field">
                        <div
                          className="adm-print-label long"
                          style={{ width: "200px" }}
                        >
                          Student Birth Certificate:
                        </div>
                        <div
                          className="adm-print-value"
                          style={{ border: "none", fontWeight: "bold" }}
                        >
                          {selectedApp.birthCertFile
                            ? "[ ✔ ] Submitted"
                            : "[   ] Missing"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🔴 Only show View buttons on screen, hide on print */}
                  <div
                    className="print-hide"
                    style={{
                      display: "flex",
                      gap: "15px",
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                    }}
                  >
                    {selectedApp.fatherNidFile && (
                      <a
                        href={getFileLink(selectedApp.fatherNidFile)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: "13px",
                          color: "#0284c7",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-eye"></i> View Father's NID
                      </a>
                    )}
                    {selectedApp.birthCertFile && (
                      <a
                        href={getFileLink(selectedApp.birthCertFile)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: "13px",
                          color: "#0284c7",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        <i className="fa-solid fa-eye"></i> View Birth
                        Certificate
                      </a>
                    )}
                  </div>

                  {/* Section 4: Commitment & Signature */}
                  <div className="adm-print-section-title">
                    4. Declaration & Signature
                  </div>
                  <div
                    className="adm-print-desc-box"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "0",
                      margin: "10px 0 30px 0",
                    }}
                  >
                    I hereby declare that all information provided above and the
                    attached documents are true and correct. I agree to abide by
                    the rules and regulations of Madrasatuz Zaytuna
                    International.
                  </div>

                  <div className="adm-print-signature-block">
                    <div className="adm-print-sign-area">
                      <div className="adm-print-sign-line">
                        {new Date().toLocaleDateString()}
                      </div>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Date of Verification
                      </span>
                    </div>
                    <div className="adm-print-sign-area">
                      <div className="adm-print-sign-line">
                        {selectedApp.guardianSignature}
                      </div>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Guardian's Signature
                      </span>
                    </div>
                  </div>

                  {/* Office Use Only Section */}
                  <div
                    className="adm-print-section-title page-break-before"
                    style={{ backgroundColor: "#1e293b", marginTop: "30px" }}
                  >
                    Office Use Only
                  </div>
                  <div className="adm-office-grid">
                    <div className="adm-office-box">
                      <div className="adm-office-title">Accounts Office</div>
                      <div className="adm-office-comment">
                        Payment verification notes...
                      </div>
                      <div className="adm-office-sign">Signature</div>
                    </div>
                    <div className="adm-office-box">
                      <div className="adm-office-title">Admission Officer</div>
                      <div className="adm-office-comment">
                        Documents verified by...
                      </div>
                      <div className="adm-office-sign">Signature</div>
                    </div>
                    <div className="adm-office-box">
                      <div className="adm-office-title">Principal</div>
                      <div className="adm-office-comment">
                        Final admission approval...
                      </div>
                      <div className="adm-office-sign">Signature</div>
                    </div>
                    <div className="adm-office-box">
                      <div className="adm-office-title">Chairman</div>
                      <div className="adm-office-comment">
                        Chairman's remarks...
                      </div>
                      <div className="adm-office-sign">Signature</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 🔴 Printable Area Ends */}

              {/* Action Area (Visible to Admin, NOT Printed) */}
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  padding: "20px 30px",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "0 0 16px 16px",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  {selectedApp.fatherNidFile && (
                    <a
                      href={getFileLink(selectedApp.fatherNidFile)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#fff",
                        border: "1px solid #0ea5e9",
                        color: "#0ea5e9",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <i className="fa-solid fa-file-pdf"></i> View NID
                    </a>
                  )}
                  {selectedApp.birthCertFile && (
                    <a
                      href={getFileLink(selectedApp.birthCertFile)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#fff",
                        border: "1px solid #0ea5e9",
                        color: "#0ea5e9",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <i className="fa-solid fa-file-pdf"></i> View Birth Cert
                    </a>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApp._id, "Rejected")
                    }
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i> Reject
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApp._id, "Admitted")
                    }
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa-solid fa-check"></i> Admit Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
