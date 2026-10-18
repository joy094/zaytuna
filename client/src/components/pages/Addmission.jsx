// src/components/pages/Admission.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // রাউটিং এর জন্য
import { useAuth } from "../../context/auth"; // আপনার Auth Context
import { toast } from "react-toastify"; // নোটিফিকেশন দেখানোর জন্য

import Layout from "./Layout";
import PreAdmissionForm from "./PreAdmissionForm"; // 🔴 আপনার নতুন ৬ ধাপের ফর্মটি ইমপোর্ট করা হলো

import "./Admission.css";

export default function Admission() {
  const [activeSection, setActiveSection] = useState("main");

  return (
    <Layout title={"Admissions - Madrasatuz Zaytuna International"}>
      <section className="page">
        <div className="wrap">
          {/* Main Dashboard */}
          {activeSection === "main" && (
            <AdmissionMain onNavigate={setActiveSection} />
          )}

          {/* 🔴 এখানে আমাদের নতুন PreAdmissionForm কল করা হয়েছে */}
          {activeSection === "pre-admission" && (
            <PreAdmissionForm onNavigate={setActiveSection} />
          )}

          {/* Track Application */}
          {activeSection === "track" && (
            <TrackApplication onNavigate={setActiveSection} />
          )}

          {/* Final Admission Form */}
          {activeSection === "admission-form" && (
            <AdmissionFormAfterOffer onNavigate={setActiveSection} />
          )}
        </div>
      </section>
    </Layout>
  );
}

// ==========================================
// 1. Main Admission Dashboard Component
// ==========================================
function AdmissionMain({ onNavigate }) {
  const [auth] = useAuth();
  const navigate = useNavigate();

  // 🔴 স্টার্ট অ্যাডমিশন বাটনে ক্লিক করলে লগইন চেক করার লজিক
  const handleStartAdmission = () => {
    if (!auth?.user) {
      toast.warning("অ্যাডমিশন ফর্ম পূরণ করতে দয়া করে আগে লগইন করুন!");
      navigate("/login", { state: "/admissions" });
    } else {
      onNavigate("pre-admission");
    }
  };

  return (
    <div className="wrap">
      {/* Header Section */}
      <div className="page-head">
        <p className="crumb">
          <a href="/">Home</a> / Admissions
        </p>
        <h2>Admissions 2027</h2>
        <p className="muted">
          Admission is open for Play, Nursery, KG, Grade 1, Grade 2 and the
          Tahfiz Wing. The founding year has 80 seats.
        </p>

        <div className="row mt-s">
          <button
            className="btn gold"
            onClick={handleStartAdmission} // 🔴 এখানে নতুন ফাংশনটি কল করা হলো
          >
            Start pre-admission
          </button>
          <button className="btn ghost" onClick={() => onNavigate("track")}>
            Track an application
          </button>
          <button
            className="btn ghost"
            onClick={() => onNavigate("admission-form")}
          >
            Admission form (after offer)
          </button>
        </div>
      </div>

      {/* The Admission Journey */}
      <div className="section-title mt">
        <p className="eyebrow">The admission journey</p>
        <h2>From first form to first day</h2>
      </div>
      <div className="journey">
        <div>
          <h4>Pre-admission</h4>
          <p>Family and child screening form.</p>
        </div>
        <div>
          <h4>Committee review</h4>
          <p>Decision within 5 working days.</p>
        </div>
        <div>
          <h4>Family interview</h4>
          <p>Both parents meet the committee.</p>
        </div>
        <div>
          <h4>Child assessment</h4>
          <p>Readiness check; Nazera for Tahfiz.</p>
        </div>
        <div>
          <h4>Offer</h4>
          <p>Offer letter with fees and a code.</p>
        </div>
        <div>
          <h4>Admission &amp; orientation</h4>
          <p>Full form, documents, fee payment.</p>
        </div>
      </div>

      {/* Admission Criteria */}
      <div className="section-title mt">
        <h2>Admission criteria</h2>
        <p className="muted">What we look for in our students and families.</p>
      </div>
      <div className="fgrid">
        <div className="card">
          <h4>Alignment of values</h4>
          <p className="muted">
            Families who share our vision of integrating Islamic values with
            modern education.
          </p>
        </div>
        <div className="card">
          <h4>Age readiness</h4>
          <p className="muted">
            The child must meet the minimum age requirements for their
            respective class.
          </p>
        </div>
        <div className="card">
          <h4>Parental commitment</h4>
          <p className="muted">
            Willingness to attend halaqa (gatherings) and actively participate
            in the child's development.
          </p>
        </div>
      </div>

      {/* Age Guide */}
      <div className="section-title mt">
        <h2>Age guide</h2>
        <p className="muted">Minimum age required as of January 1, 2027.</p>
      </div>
      <div className="card">
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "10px 0" }}>Class</th>
              <th style={{ padding: "10px 0" }}>Minimum Age</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 0" }}>Play</td>
              <td style={{ padding: "10px 0" }}>4+ Years</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 0" }}>Nursery</td>
              <td style={{ padding: "10px 0" }}>5+ Years</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 0" }}>KG</td>
              <td style={{ padding: "10px 0" }}>6+ Years</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 0" }}>Grade 1</td>
              <td style={{ padding: "10px 0" }}>7+ Years</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fees Section */}
      <div className="section-title mt">
        <h2>Fees & Payments</h2>
        <p className="muted">
          Transparent fee structure for the 2027 academic year.
        </p>
      </div>
      <div className="fgrid">
        <div className="card">
          <h4>Admission Fee</h4>
          <p className="muted">
            A one-time non-refundable fee paid at the time of admission.
          </p>
          <h3 style={{ color: "var(--gold)", marginTop: "10px" }}>৳ 15,000</h3>
        </div>
        <div className="card">
          <h4>Monthly Tuition</h4>
          <p className="muted">
            Payable by the 10th of every month. Includes standard
            extracurriculars.
          </p>
          <h3 style={{ color: "var(--gold)", marginTop: "10px" }}>
            ৳ 3,000 / month
          </h3>
        </div>
      </div>

      {/* Questions Families Ask (FAQ) */}
      <div className="section-title mt">
        <h2>Questions families ask</h2>
      </div>
      <div className="stack card">
        <details
          style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: "10px",
          }}
        >
          <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
            Do both parents need to attend the interview?
          </summary>
          <p className="muted" style={{ marginTop: "10px" }}>
            Yes, we highly encourage both parents to be present so we can
            discuss the shared responsibilities of your child's education.
          </p>
        </details>
        <details
          style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: "10px",
          }}
        >
          <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
            Is the admission fee refundable?
          </summary>
          <p className="muted" style={{ marginTop: "10px" }}>
            No, the admission fee is non-refundable as it covers the
            administrative costs.
          </p>
        </details>
        <details>
          <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
            Are there any hidden charges?
          </summary>
          <p className="muted" style={{ marginTop: "10px" }}>
            No, we believe in complete transparency. Uniforms and specific books
            may incur actual costs, but there are no hidden school charges.
          </p>
        </details>
      </div>
    </div>
  );
}

// ==========================================
// 3. Track Application & Offer Form
// ==========================================
function TrackApplication({ onNavigate }) {
  return (
    <div className="wrap narrow">
      <div className="page-head">
        <h2>Track your application</h2>
      </div>
      <form className="card">
        <div className="fgrid">
          <label>
            Reference number
            <input required placeholder="ZI-27-0000" />
          </label>
          <label>
            Mobile used on the form
            <input type="tel" required />
          </label>
        </div>
        <div className="row mt-s">
          <button className="btn" type="submit">
            Check status
          </button>
          <button
            className="btn ghost sm"
            type="button"
            onClick={() => onNavigate("main")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function AdmissionFormAfterOffer({ onNavigate }) {
  return (
    <div className="wrap narrow">
      <div className="page-head">
        <h2>Admission form</h2>
      </div>
      <form className="card">
        <div className="fgrid">
          <label>
            Reference number
            <input required />
          </label>
          <label>
            Offer code
            <input required inputMode="numeric" />
          </label>
        </div>
        <div className="row mt-s">
          <button className="btn" type="submit">
            Open form
          </button>
          <button
            className="btn ghost sm"
            type="button"
            onClick={() => onNavigate("main")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
