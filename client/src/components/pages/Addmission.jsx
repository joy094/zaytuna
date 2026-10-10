import React, { useState } from "react";
import Layout from "./Layout"; // আপনার Layout কম্পোনেন্ট ইম্পোর্ট করা হলো
import "./Admission.css"; // আপনার CSS ফাইল (যদি আলাদা থাকে)

export default function Admission() {
  const [activeSection, setActiveSection] = useState("main");

  return (
    // Layout কম্পোনেন্ট দিয়ে পুরো পেজ র‍্যাপ করা হলো, ঠিক About পেজের মতো
    <Layout title={"Admissions - Madrasatuz Zaytuna International"}>
      <section className="page">
        <div className="wrap">
          {activeSection === "main" && (
            <AdmissionMain onNavigate={setActiveSection} />
          )}
          {activeSection === "pre-admission" && (
            <PreAdmission onNavigate={setActiveSection} />
          )}
          {activeSection === "track" && (
            <TrackApplication onNavigate={setActiveSection} />
          )}
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
            onClick={() => onNavigate("pre-admission")}
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
// 2. Pre-Admission Form Component
// ==========================================
function PreAdmission({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="wrap narrow">
      <div className="page-head">
        <p className="crumb">
          <span
            style={{ cursor: "pointer", color: "var(--muted)" }}
            onClick={() => onNavigate("main")}
          >
            Admissions
          </span>{" "}
          / Pre-admission
        </p>
        <h2>Pre-admission form</h2>
        <p className="bn" style={{ color: "var(--olive)" }}>
          প্রাক-ভর্তি ফরম
        </p>
        <p className="muted">
          This form helps the admission committee understand your family and
          your child. Please answer honestly.
        </p>
      </div>

      <div id="preWrap">
        <div className="steps" id="preSteps">
          <span
            className={currentStep === 0 ? "on" : currentStep > 0 ? "done" : ""}
          >
            1 · Child
          </span>
          <span
            className={currentStep === 1 ? "on" : currentStep > 1 ? "done" : ""}
          >
            2 · Family
          </span>
          <span
            className={currentStep === 2 ? "on" : currentStep > 2 ? "done" : ""}
          >
            3 · Deen
          </span>
          <span
            className={currentStep === 3 ? "on" : currentStep > 3 ? "done" : ""}
          >
            4 · Home
          </span>
          <span
            className={currentStep === 4 ? "on" : currentStep > 4 ? "done" : ""}
          >
            5 · Habits
          </span>
          <span
            className={currentStep === 5 ? "on" : currentStep > 5 ? "done" : ""}
          >
            6 · Commitment
          </span>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 0 && (
            <fieldset>
              <legend>About your child</legend>
              <p className="legend-bn">সন্তানের তথ্য</p>
              <div className="fgrid">
                <label>
                  Child's full name
                  <input required />
                </label>
                <label>
                  Date of birth
                  <input type="date" required />
                </label>
                <label>
                  Class sought for 2027
                  <select required>
                    <option value="">Select</option>
                    <option>Play</option>
                    <option>Nursery</option>
                  </select>
                </label>
              </div>
            </fieldset>
          )}

          {currentStep > 0 && currentStep < 5 && (
            <fieldset>
              <legend>Section {currentStep + 1}</legend>
              <div className="stack">
                <p className="muted">Form fields for this section go here.</p>
              </div>
            </fieldset>
          )}

          {currentStep === 5 && (
            <fieldset>
              <legend>Commitment</legend>
              <p className="legend-bn">অঙ্গীকার</p>
              <div className="q">
                <p className="qt">If admitted, we commit to the following</p>
                <label className="check">
                  <input type="checkbox" required />
                  Keep our child away from video games.
                </label>
              </div>
              <label>
                Guardian's signature
                <input required />
              </label>
            </fieldset>
          )}

          <div className="form-nav mt">
            <button
              className="btn ghost"
              type="button"
              onClick={() =>
                currentStep === 0 ? onNavigate("main") : prevStep()
              }
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </button>
            <div className="row">
              {currentStep < 5 ? (
                <button className="btn" type="button" onClick={nextStep}>
                  Continue
                </button>
              ) : (
                <button className="btn gold" type="submit">
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </form>
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
