// src/components/pages/Admission.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Layout from "../../components/pages/Layout";
import PreAdmissionForm from "./PreAdmissionForm";
import "./Admission.css";

export default function Admission() {
  const [activeSection, setActiveSection] = useState("main");
  const location = useLocation();

  // 🔴 হেডার মেনু থেকে লিংকে ক্লিক করলে অটো-স্ক্রল বা ফর্ম ওপেন করার লজিক
  useEffect(() => {
    // যদি URL এ '/apply' থাকে (Apply Online মেনুর জন্য)
    if (location.pathname.includes("/apply") || location.hash === "#apply") {
      setActiveSection("pre-admission");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // যদি হ্যাশ-লিংক থাকে (#procedure, #scholarship, #fees)
    else if (location.hash) {
      setActiveSection("main"); // মেইন সেকশনে ফিরে আসবে
      setTimeout(() => {
        const element = document.getElementById(location.hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
    // সাধারণ ভিজিটের ক্ষেত্রে
    else {
      setActiveSection("main");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

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
    <div className="admission-main-container" id="policy">
      {/* Header Section */}
      <div className="adm-page-head">
        <p className="adm-crumb">
          <a href="/">Home</a> / Admissions
        </p>
        <h2>Admissions 2027</h2>
        <p className="adm-muted">
          Admission is open for Play, Nursery, KG 1, KG 2, Grade 1, Grade 2 and
          the Tahfiz Wing. The first session starts in January 2027, and from
          July 2027, the school will follow a July–June academic year.
        </p>
        <p className="adm-muted mt-s">
          <strong>Admission enquiries:</strong> Asif Mostofa (Admission &
          Communication Officer) | Phone: +880 1841-515454
        </p>

        <div className="adm-action-row mt-s">
          <button
            className="adm-btn adm-btn-primary"
            onClick={handleStartAdmission}
          >
            Apply Online <i className="fa-solid fa-arrow-right"></i>
          </button>
          {/* <button
            className="adm-btn adm-btn-outline"
            onClick={() => onNavigate("admission-form")}
          >
            Admission Form (After Offer)
          </button> */}
        </div>
      </div>

      {/* The Admission Journey (#procedure) */}
      <div className="adm-section-title mt-l" id="procedure">
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
            Willingness to attend halaqah (gatherings) and actively participate
            in the child's development.
          </p>
        </div>
      </div>

      {/* 🔴 NEW: Waiver and Scholarship (#scholarship) */}
      <div className="adm-section-title mt-l" id="scholarship">
        <h2>Waiver and Scholarship</h2>
        <p className="adm-muted">
          Ensuring quality education is accessible for deserving families.
        </p>
      </div>
      <div className="adm-fgrid">
        <div className="adm-card" style={{ borderTop: "4px solid #059669" }}>
          <div className="card-icon">
            <i className="fa-solid fa-award"></i>
          </div>
          <h4>Merit Scholarship</h4>
          <p className="adm-muted">
            Special tuition waivers for students demonstrating exceptional
            academic or Hifz (memorization) excellence during the assessment.
          </p>
        </div>
        <div className="adm-card" style={{ borderTop: "4px solid #059669" }}>
          <div className="card-icon">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <h4>Financial Assistance</h4>
          <p className="adm-muted">
            Need-based financial aid is available for deserving families.
            Applications are reviewed confidentially by the management
            committee.
          </p>
        </div>
        <div className="adm-card" style={{ borderTop: "4px solid #059669" }}>
          <div className="card-icon">
            <i className="fa-solid fa-children"></i>
          </div>
          <h4>Sibling Discount</h4>
          <p className="adm-muted">
            We offer special tuition fee waivers for families enrolling more
            than one child at Madrasatuz Zaytuna International.
          </p>
        </div>
      </div>

      {/* Fees Section (#fees) */}
      <div className="adm-section-title mt-l" id="fees">
        <h2>Fees & Payments</h2>
        <p className="adm-muted">
          Monthly tuition is due by the 10th of each month.
        </p>
      </div>
      <div className="adm-table-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Fee</th>
              <th>How often</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admission form & assessment fee</td>
              <td>Once, with the application (non-refundable)</td>
              <td>Please contact the admission office</td>
            </tr>
            <tr>
              <td>Admission fee</td>
              <td>Once, when admission is confirmed (non-refundable)</td>
              <td>Please contact the admission office</td>
            </tr>
            <tr>
              <td>Annual fee</td>
              <td>Every year</td>
              <td>Please contact the admission office</td>
            </tr>
            <tr>
              <td>Monthly tuition fee</td>
              <td>Monthly (all 12 months)</td>
              <td>Please contact the admission office</td>
            </tr>
            <tr>
              <td>Books & materials</td>
              <td>Every year (varies by class)</td>
              <td>Please contact the admission office</td>
            </tr>
            <tr>
              <td>Hifz (Tahfiz) section fee</td>
              <td>Monthly (includes meals)</td>
              <td>Please contact the admission office</td>
            </tr>
          </tbody>
        </table>
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
