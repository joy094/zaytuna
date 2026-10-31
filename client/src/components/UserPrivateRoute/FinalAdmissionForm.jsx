import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./FinalAdmissionForm.css";

export default function FinalAdmissionForm({ onNavigate, userPreData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔴 নতুন স্টেট সাবমিট বাটনের জন্য
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    studentName: userPreData?.studentName || "",
    dob: userPreData?.dob || "",
    applyingClass: userPreData?.applyingClass || "",
    session: "",
    fatherNid: "",
    motherNid: "",
    fatherMobile: userPreData?.fatherMobile || "",
    motherMobile: "",
    email: userPreData?.email || "",
    emergencyName: "",
    emergencyMobile: "",
    siblingName: "",
    siblingClass: "",
    declaration: false,
    guardianName: "",
    guardianSignature: "",
  });

  const [files, setFiles] = useState({
    fatherNidFile: null,
    birthCertFile: null,
    photoFile: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `File "${file.name}" is too large! Maximum allowed size is 2MB.`,
        );
        e.target.value = "";
        return;
      }
      setFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!refNumber || !offerCode) {
      toast.warning("Please enter both Reference Number and Offer Code.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post("/api/v1/admission/verify-offer-code", {
        refNumber,
        offerCode,
      });

      if (response.data.success) {
        setIsUnlocked(true);
        toast.success(
          response.data.message ||
            "Security verification successful! Form unlocked.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(
          response.data.message || "Invalid Reference Number or Offer Code!",
        );
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Please check your credentials and try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // 🔴 Handle Final Submission with Axios (FormData)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!formData.declaration) {
      toast.warning("Please agree to the declaration and consent.");
      return;
    }

    // ফাইলগুলো সিলেক্ট করা হয়েছে কিনা চেক করা
    if (!files.fatherNidFile || !files.birthCertFile || !files.photoFile) {
      toast.error("Please upload all the required documents.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔴 যেহেতু ফাইল আছে, তাই FormData অবজেক্ট তৈরি করতে হবে
      const submitData = new FormData();

      // রেফারেন্স নাম্বারটি ডেটাবেসে খোঁজার জন্য পাঠানো হচ্ছে
      submitData.append("refNumber", refNumber);

      // সমস্ত টেক্সট ডেটা অ্যাপেন্ড করা
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // 3টি ফাইল অ্যাপেন্ড করা
      submitData.append("fatherNidFile", files.fatherNidFile);
      submitData.append("birthCertFile", files.birthCertFile);
      submitData.append("photoFile", files.photoFile);

      // 🔴 Axios Post Request
      const response = await axios.post(
        "/api/v1/admission/final-submit",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 🔴 ফাইলের জন্য এই হেডার বাধ্যতামূলক
          },
        },
      );

      if (response.data.success) {
        toast.success("Final Application submitted successfully!");
        setIsSuccess(true); // 🔴 ফর্ম সাবমিট সফল হলে এটি true হবে

        // চাইলে কয়েক সেকেন্ড পর অন্য পেজে পাঠাতে পারেন
        setTimeout(() => {
          if (onNavigate) onNavigate("dashboard");
        }, 3000);
      } else {
        toast.error(response.data.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Final Submit Error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting the application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="final-admission-container">
      {!isUnlocked ? (
        <div className="locked-state-wrapper">
          <div
            className="form-header text-center"
            style={{ borderBottom: "none", margin: "20px" }}
          >
            <h2 className="form-title" style={{ color: "#059669" }}>
              <i
                className="fa-solid fa-lock"
                style={{ marginRight: "8px" }}
              ></i>{" "}
              Security Verification
            </h2>
            <p
              className="adm-muted"
              style={{ color: "#64748b", fontSize: "0.95rem" }}
            >
              Please enter your Application Reference Number and the
              confidential <strong>Offer Code</strong> sent to your registered
              email.
            </p>
          </div>
          <form
            className="adm-card lock-form"
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0",
            }}
            onSubmit={handleUnlock}
          >
            <div className="input-group" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#334155",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Reference Number *
              </label>
              <input
                type="text"
                required
                className="form-control"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                }}
                placeholder="e.g. ZI-27-0001"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                disabled={isVerifying}
              />
            </div>
            <div className="input-group">
              <label
                style={{
                  color: "#334155",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Offer Code *
              </label>
              <input
                type="text"
                required
                className="form-control"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                }}
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
                disabled={isVerifying}
              />
            </div>
            <div
              className="action-btns"
              style={{ display: "flex", gap: "10px", marginTop: "25px" }}
            >
              <button
                type="submit"
                disabled={isVerifying}
                style={{
                  flex: 1,
                  background: isVerifying ? "#94a3b8" : "#059669",
                  color: "#fff",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: isVerifying ? "not-allowed" : "pointer",
                }}
              >
                {isVerifying ? "Verifying..." : "Verify & Unlock Form"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="unlocked-state-wrapper">
          <div className="form-header text-center">
            <h1 className="school-name">MADRASATUZ ZAYTUNA INTERNATIONAL</h1>
            <p className="school-tagline">
              A Cambridge-Curriculum-Based School & Madrasah
            </p>
            <h2 className="form-title">ADMISSION FORM</h2>
            <p className="form-note">
              <strong>Purpose:</strong> This form is for applicants who have
              already completed the pre-admission process and have been deemed
              eligible for admission. Keep the form concise and do not repeat
              information already collected in the pre-admission form unless
              listed below.
            </p>
          </div>

          <form className="final-form-body" onSubmit={handleFinalSubmit}>
            {/* Section 1 */}
            <div className="form-section">
              <h3 className="section-title">
                Section 1: Student & Programme Information
              </h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>
                    Student's Full Name *{" "}
                    <small>(As per birth certificate)</small>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="input-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Class Applying For *</label>
                  <select
                    name="applyingClass"
                    required
                    value={formData.applyingClass}
                    onChange={handleChange}
                  >
                    <option value="">Select a class...</option>
                    <option value="Play">Play</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG 1">KG 1</option>
                    <option value="KG 2">KG 2</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Tahfiz Wing">Tahfiz Wing</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Academic Session *</label>
                  <select
                    name="session"
                    required
                    value={formData.session}
                    onChange={handleChange}
                  >
                    <option value="">Select session...</option>
                    <option value="January 2027">January 2027</option>
                    <option value="July 2027">July 2027</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="form-section">
              <h3 className="section-title">Section 2: Family Information</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Father's National ID (NID) Number *</label>
                  <input
                    type="text"
                    name="fatherNid"
                    required
                    value={formData.fatherNid}
                    onChange={handleChange}
                    placeholder="Enter NID number"
                  />
                </div>
                <div className="input-group">
                  <label>Mother's National ID (NID) Number *</label>
                  <input
                    type="text"
                    name="motherNid"
                    required
                    value={formData.motherNid}
                    onChange={handleChange}
                    placeholder="Enter NID number"
                  />
                </div>
                <div className="input-group">
                  <label>Father's Mobile Number *</label>
                  <input
                    type="tel"
                    name="fatherMobile"
                    required
                    value={formData.fatherMobile}
                    onChange={handleChange}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div className="input-group">
                  <label>Mother's Mobile Number *</label>
                  <input
                    type="tel"
                    name="motherMobile"
                    required
                    value={formData.motherMobile}
                    onChange={handleChange}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>
              <div
                className="input-group full-width"
                style={{ marginTop: "15px" }}
              >
                <label>
                  Parents' Email Address *{" "}
                  <small>(For official notices and communication)</small>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-grid" style={{ marginTop: "15px" }}>
                <div className="input-group">
                  <label>Emergency Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyName"
                    required
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Name of emergency contact"
                  />
                </div>
                <div className="input-group">
                  <label>Emergency Contact Mobile Number *</label>
                  <input
                    type="tel"
                    name="emergencyMobile"
                    required
                    value={formData.emergencyMobile}
                    onChange={handleChange}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
              <div className="optional-box" style={{ marginTop: "15px" }}>
                <h4>Sibling(s) at Zaytuna (Optional)</h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Sibling's Name</label>
                    <input
                      type="text"
                      name="siblingName"
                      value={formData.siblingName}
                      onChange={handleChange}
                      placeholder="Enter sibling's name, if applicable"
                    />
                  </div>
                  <div className="input-group">
                    <label>Sibling's Class</label>
                    <input
                      type="text"
                      name="siblingClass"
                      value={formData.siblingClass}
                      onChange={handleChange}
                      placeholder="Enter sibling's class"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="form-section">
              <h3 className="section-title">Section 3: Required Documents</h3>
              <p className="section-subtitle">
                Upload clear, legible copies of the following documents.
              </p>
              <div
                className="file-helper-box"
                style={{ marginBottom: "1.5rem" }}
              >
                <h5>
                  <i
                    className="fa-solid fa-lightbulb text-warning"
                    style={{ marginRight: "8px" }}
                  ></i>{" "}
                  Tips for File Upload
                </h5>
                <ul>
                  <li>
                    <strong>Maximum File Size:</strong> 2 MB per file.
                  </li>
                  <li>
                    <strong>Image Compress (JPG/PNG):</strong> If your photo is
                    too large, use{" "}
                    <a
                      href="https://tinypng.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TinyPNG
                    </a>{" "}
                    to reduce size.
                  </li>
                </ul>
              </div>
              <div className="upload-grid" style={{ marginTop: "15px" }}>
                <div className="upload-box">
                  <label>
                    1. Father's National ID Card * <br />
                    <small>(PDF, JPG or PNG | Max: 2MB)</small>
                  </label>
                  <div className="file-input-wrapper">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>
                      {files.fatherNidFile
                        ? files.fatherNidFile.name
                        : "Father's NID Card - File Upload"}
                    </span>
                    <input
                      type="file"
                      name="fatherNidFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="upload-box">
                  <label>
                    2. Student's Birth Certificate * <br />
                    <small>(PDF, JPG or PNG | Max: 2MB)</small>
                  </label>
                  <div className="file-input-wrapper">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>
                      {files.birthCertFile
                        ? files.birthCertFile.name
                        : "Birth Certificate - File Upload"}
                    </span>
                    <input
                      type="file"
                      name="birthCertFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="upload-box">
                  <label>
                    3. Student's Passport-Size Photograph * <br />
                    <small>(JPG or PNG | Max: 2MB)</small>
                  </label>
                  <div className="file-input-wrapper">
                    <i className="fa-regular fa-image"></i>
                    <span>
                      {files.photoFile
                        ? files.photoFile.name
                        : "Student Photograph - File Upload"}
                    </span>
                    <input
                      type="file"
                      name="photoFile"
                      accept=".jpg,.jpeg,.png"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="form-section declaration-section">
              <h3 className="section-title">
                Section 4: Declaration & Consent
              </h3>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="declaration"
                  required
                  checked={formData.declaration}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <p>
                  I/We confirm that we have read and understood the school's{" "}
                  <strong>
                    Code of Conduct, Dress Code, and Safeguarding Policy
                  </strong>
                  , and agree to comply with and abide by them. *
                </p>
              </label>
              <div className="form-grid" style={{ marginTop: "15px" }}>
                <div className="input-group">
                  <label>Parent/Guardian's Full Name *</label>
                  <input
                    type="text"
                    name="guardianName"
                    required
                    value={formData.guardianName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="input-group">
                  <label>Parent/Guardian's Signature (Type Full Name) *</label>
                  <input
                    type="text"
                    name="guardianSignature"
                    required
                    value={formData.guardianSignature}
                    onChange={handleChange}
                    placeholder="Type full name as electronic signature"
                  />
                </div>
              </div>
            </div>

            <div className="submit-section text-center">
              <button
                type="submit"
                className="btn-submit-final"
                disabled={isSubmitting || isSuccess}
                style={{
                  background: isSuccess ? "#10b981" : "", // সাকসেস হলে সবুজ হয়ে যাবে
                  opacity: isSubmitting || isSuccess ? 0.7 : 1,
                  cursor: isSubmitting || isSuccess ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : isSuccess
                    ? "✅ Successfully Submitted"
                    : "Submit Application"}
              </button>
              <p className="submit-note">
                Please review all information before submitting. Submission of
                this form does not itself confirm final admission.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
