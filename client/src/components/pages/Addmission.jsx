// src/components/pages/Admission.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Layout from "../../components/pages/Layout";
import PreAdmissionForm from "./PreAdmissionForm";
import "./Admission.css";

export default function Admission() {
  const [activeSection, setActiveSection] = useState("main");

  return (
    <Layout title={"Admissions - Madrasatuz Zaytuna International"}>
      <section className="admission-page-wrapper">
        <div className="admission-wrap">
          {/* Main Dashboard */}
          {activeSection === "main" && (
            <AdmissionMain onNavigate={setActiveSection} />
          )}

          {/* Pre-Admission Form */}
          {activeSection === "pre-admission" && (
            <PreAdmissionForm onNavigate={setActiveSection} />
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

  const handleStartAdmission = () => {
    if (!auth?.user) {
      toast.warning("Please login to fill out the admission form!");
      navigate("/login", { state: "/admissions" });
    } else {
      onNavigate("pre-admission");
    }
  };

  return (
    <div className="admission-main-container">
      {/* Header Section */}
      <div className="adm-page-head">
        <p className="adm-crumb">
          <a href="/">Home</a> / Admissions
        </p>
        <h2>Admissions 2027</h2>
        <p className="adm-muted">
          Admission is open for Play, Nursery, KG, Grade 1, Grade 2 and the
          Tahfiz Wing. The founding year has 80 seats.
        </p>

        <div className="adm-action-row mt-s">
          <button
            className="adm-btn adm-btn-primary"
            onClick={handleStartAdmission}
          >
            Start Pre-Admission <i className="fa-solid fa-arrow-right"></i>
          </button>
          <button
            className="adm-btn adm-btn-outline"
            onClick={() => onNavigate("admission-form")}
          >
            Admission Form (After Offer)
          </button>
        </div>
      </div>

      {/* The Admission Journey */}
      <div className="adm-section-title mt-l">
        <p className="adm-eyebrow">The admission journey</p>
        <h2>From first form to first day</h2>
      </div>
      <div className="adm-journey-grid">
        <div className="adm-journey-step">
          <div className="step-number">1</div>
          <h4>Pre-admission</h4>
          <p>Family and child screening form.</p>
        </div>
        <div className="adm-journey-step">
          <div className="step-number">2</div>
          <h4>Committee review</h4>
          <p>Decision within 5 working days.</p>
        </div>
        <div className="adm-journey-step">
          <div className="step-number">3</div>
          <h4>Family interview</h4>
          <p>Both parents meet the committee.</p>
        </div>
        <div className="adm-journey-step">
          <div className="step-number">4</div>
          <h4>Child assessment</h4>
          <p>Readiness check; Nazera for Tahfiz.</p>
        </div>
        <div className="adm-journey-step">
          <div className="step-number">5</div>
          <h4>Offer</h4>
          <p>Offer letter with fees and a code.</p>
        </div>
        <div className="adm-journey-step">
          <div className="step-number">6</div>
          <h4>Admission & orientation</h4>
          <p>Full form, documents, fee payment.</p>
        </div>
      </div>

      {/* Admission Criteria */}
      <div className="adm-section-title mt-l">
        <h2>Admission criteria</h2>
        <p className="adm-muted">
          What we look for in our students and families.
        </p>
      </div>
      <div className="adm-fgrid">
        <div className="adm-card">
          <div className="card-icon">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h4>Alignment of values</h4>
          <p className="adm-muted">
            Families who share our vision of integrating Islamic values with
            modern education.
          </p>
        </div>
        <div className="adm-card">
          <div className="card-icon">
            <i className="fa-solid fa-child-reaching"></i>
          </div>
          <h4>Age readiness</h4>
          <p className="adm-muted">
            The child must meet the minimum age requirements for their
            respective class.
          </p>
        </div>
        <div className="adm-card">
          <div className="card-icon">
            <i className="fa-solid fa-people-roof"></i>
          </div>
          <h4>Parental commitment</h4>
          <p className="adm-muted">
            Willingness to attend halaqa (gatherings) and actively participate
            in the child's development.
          </p>
        </div>
      </div>

      {/* Age Guide */}
      <div className="adm-section-title mt-l">
        <h2>Age guide</h2>
        <p className="adm-muted">Minimum age required as of January 1, 2027.</p>
      </div>
      <div className="adm-table-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Minimum Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Play</td>
              <td>4+ Years</td>
            </tr>
            <tr>
              <td>Nursery</td>
              <td>5+ Years</td>
            </tr>
            <tr>
              <td>KG</td>
              <td>6+ Years</td>
            </tr>
            <tr>
              <td>Grade 1</td>
              <td>7+ Years</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fees Section */}
      <div className="adm-section-title mt-l">
        <h2>Fees & Payments</h2>
        <p className="adm-muted">
          Transparent fee structure for the 2027 academic year.
        </p>
      </div>
      <div className="adm-fgrid">
        <div className="adm-card fee-card">
          <h4>Admission Fee</h4>
          <p className="adm-muted">
            A one-time non-refundable fee paid at the time of admission.
          </p>
          <h3 className="fee-amount">৳ 15,000</h3>
        </div>
        <div className="adm-card fee-card">
          <h4>Monthly Tuition</h4>
          <p className="adm-muted">
            Payable by the 10th of every month. Includes standard
            extracurriculars.
          </p>
          <h3 className="fee-amount">
            ৳ 3,000 <span>/ month</span>
          </h3>
        </div>
      </div>

      {/* Questions Families Ask (FAQ) */}
      <div className="adm-section-title mt-l">
        <h2>Questions families ask</h2>
      </div>
      <div className="adm-faq-container">
        <details className="adm-faq">
          <summary>Do both parents need to attend the interview?</summary>
          <p>
            Yes, we highly encourage both parents to be present so we can
            discuss the shared responsibilities of your child's education.
          </p>
        </details>
        <details className="adm-faq">
          <summary>Is the admission fee refundable?</summary>
          <p>
            No, the admission fee is non-refundable as it covers the
            administrative costs.
          </p>
        </details>
        <details className="adm-faq">
          <summary>Are there any hidden charges?</summary>
          <p>
            No, we believe in complete transparency. Uniforms and specific books
            may incur actual costs, but there are no hidden school charges.
          </p>
        </details>
      </div>
    </div>
  );
}

// ==========================================
// 2. Admission Form After Offer
// ==========================================
function AdmissionFormAfterOffer({ onNavigate }) {
  return (
    <div className="admission-main-container narrow">
      <div className="adm-page-head">
        <h2>Admission form (After Offer)</h2>
      </div>
      <form className="adm-card">
        <div className="adm-form-grid">
          <div className="adm-input-group">
            <label>Reference number</label>
            <input type="text" required placeholder="e.g. ZI-27-0001" />
          </div>
          <div className="adm-input-group">
            <label>Offer code</label>
            <input
              type="text"
              required
              inputMode="numeric"
              placeholder="Enter your 4 or 6 digit code"
            />
          </div>
        </div>
        <div className="adm-action-row mt-l">
          <button className="adm-btn adm-btn-primary" type="submit">
            Open Form
          </button>
          <button
            className="adm-btn adm-btn-outline"
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
