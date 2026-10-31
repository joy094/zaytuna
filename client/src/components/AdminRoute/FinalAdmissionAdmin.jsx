import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./FinalAdmissionAdmin.css"; // Pure CSS Import

export default function FinalAdmissionAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/";

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
                <th>Ref ID</th>
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

      {selectedApp && (
        <div className="adm-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div
            className="adm-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h5 className="adm-modal-title">
                Application Details: {selectedApp.applicationId}
              </h5>
              <button
                type="button"
                className="adm-btn-close"
                onClick={() => setSelectedApp(null)}
              >
                &times;
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="adm-modal-grid">
                {/* Info Column */}
                <div className="adm-grid-col">
                  <h5 className="adm-section-title">Student Info</h5>
                  <table className="adm-info-table">
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{selectedApp.studentName}</td>
                      </tr>
                      <tr>
                        <th>Date of Birth</th>
                        <td>{selectedApp.dob}</td>
                      </tr>
                      <tr>
                        <th>Applying Class</th>
                        <td>{selectedApp.applyingClass}</td>
                      </tr>
                      <tr>
                        <th>Session</th>
                        <td>{selectedApp.session}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h5 className="adm-section-title mt-4">Family Info</h5>
                  <table className="adm-info-table">
                    <tbody>
                      <tr>
                        <th>Father's NID</th>
                        <td>{selectedApp.fatherNid}</td>
                      </tr>
                      <tr>
                        <th>Mother's NID</th>
                        <td>{selectedApp.motherNid}</td>
                      </tr>
                      <tr>
                        <th>Father's Mobile</th>
                        <td>{selectedApp.fatherMobile}</td>
                      </tr>
                      <tr>
                        <th>Mother's Mobile</th>
                        <td>{selectedApp.motherMobile}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{selectedApp.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Documents Column */}
                <div className="adm-grid-col">
                  <h5 className="adm-section-title">Uploaded Documents</h5>

                  {/* Father NID */}
                  <div className="adm-doc-card">
                    <p>1. Father's NID</p>
                    {selectedApp.fatherNidFile ? (
                      <a
                        href={getFileLink(selectedApp.fatherNidFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view-doc"
                      >
                        <i className="fa-solid fa-file-pdf"></i> View Document
                      </a>
                    ) : (
                      <span className="text-danger">Not Uploaded</span>
                    )}
                  </div>

                  {/* Birth Certificate */}
                  <div className="adm-doc-card">
                    <p>2. Birth Certificate</p>
                    {selectedApp.birthCertFile ? (
                      <a
                        href={getFileLink(selectedApp.birthCertFile)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view-doc"
                      >
                        <i className="fa-solid fa-file-pdf"></i> View Document
                      </a>
                    ) : (
                      <span className="text-danger">Not Uploaded</span>
                    )}
                  </div>

                  {/* Photo */}
                  <div className="adm-doc-card">
                    <p>3. Student Photo</p>
                    {selectedApp.photoFile ? (
                      <div className="text-center">
                        <div className="adm-image-preview">
                          <img
                            src={getFileLink(selectedApp.photoFile)}
                            alt="Student"
                          />
                        </div>
                        <a
                          href={getFileLink(selectedApp.photoFile)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-open-img"
                        >
                          <i className="fa-solid fa-external-link-alt"></i> Open
                          Full Image
                        </a>
                      </div>
                    ) : (
                      <span className="text-danger">Not Uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <span className="adm-footer-sig">
                Guardian Signature:{" "}
                <strong>{selectedApp.guardianSignature}</strong>
              </span>

              <div className="adm-action-btns">
                <button
                  className="btn-reject"
                  onClick={() =>
                    handleStatusUpdate(selectedApp._id, "Rejected")
                  }
                >
                  <i className="fa-solid fa-xmark"></i> Reject
                </button>
                <button
                  className="btn-admit"
                  onClick={() =>
                    handleStatusUpdate(selectedApp._id, "Admitted")
                  }
                >
                  <i className="fa-solid fa-check"></i> Admit Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
