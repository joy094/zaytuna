import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import "./AboutPage.css";

const About = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const { hash } = useLocation();

  // হেডার মেনু থেকে হ্যাস-লিংকে (#chairman, #why-choose-us) ক্লিক করলে অটো স্ক্রল করার লজিক
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  // ক্লায়েন্টের নির্দেশিত ক্যাম্পাসের ফ্লোর ডেটা
  const campusFloors = [
    { id: 8, title: "Studio", details: "School studio and media room." },
    {
      id: 7,
      title: "Auditorium",
      details: "Main auditorium for events and gatherings.",
    },
    {
      id: 6,
      title: "Hifz (Tahfiz) wing",
      details: "Dedicated wing for the Hifz programme.",
    },
    {
      id: 5,
      title: "Classrooms & facilities",
      details: "Classrooms, teachers' rooms, library, computer lab.",
    },
    {
      id: 4,
      title: "Classrooms & facilities",
      details: "Classrooms, teachers' rooms, library, computer lab.",
    },
    {
      id: 3,
      title: "Classrooms & facilities",
      details: "Classrooms, teachers' rooms, library, computer lab.",
    },
    {
      id: 2,
      title: "Classrooms & facilities",
      details: "Classrooms, teachers' rooms, library, computer lab.",
    },
    {
      id: 1,
      title: "Office",
      details:
        "Reception, accounts, Vice Principal, Principal, and Chairman's office.",
    },
    { id: 0, title: "Ground Floor", details: "Playground for students." },
  ];

  return (
    <Layout title={"About Zaytuna - Madrasatuz Zaytuna International"}>
      <div className="zaytuna-modern-wrapper">
        {/* =========================================
            1. Header & Overview Section (#overview)
        ========================================= */}
        <div className="zaytuna-page-header" id="overview">
          <p className="breadcrumb-text">Home / About Us</p>
          <h1 className="main-title">Madrasatuz Zaytuna International</h1>
          <p
            className="tagline-text"
            style={{
              fontWeight: "bold",
              color: "#059669",
              marginBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            A Cambridge Curriculum-Based School & Madrasah
          </p>
          <p className="main-subtitle">
            The olive tree is named in the Qur'an as blessed: deep-rooted,
            long-living and generous. We want the same for our students: firm
            roots in iman and knowledge, and a life that benefits others.
          </p>
        </div>

        {/* =========================================
            2. Vision, Mission & Message (#chairman)
        ========================================= */}
        <div className="top-info-grid">
          {/* Left Side: Vision, Mission, Core Values */}
          <div className="info-column">
            <div className="info-block">
              <h2>Vision</h2>
              <p>
                A generation grounded in the Qur'an and Sunnah, fluent in
                Arabic, English and Bangla, and ready to lead with knowledge and
                good character. <span className="draft-badge">DRAFT</span>
              </p>
            </div>

            <div className="info-block">
              <h2>Mission</h2>
              <p>
                To unite classical Islamic learning and modern schooling in one
                curriculum, so no child has to choose between deen and an
                excellent education. <span className="draft-badge">DRAFT</span>
              </p>
            </div>

            <div className="info-block">
              <h2>Core Values</h2>
              <div className="values-container">
                <span className="value-item">العلم · 'Ilm</span>
                <span className="value-item">الإيمان · Iman</span>
                <span className="value-item">الأدب · Adab</span>
                <span className="value-item">العمل · 'Amal</span>
                <span className="value-item">العمران · 'Umran</span>
              </div>
            </div>
          </div>

          {/* Right Side: Message from Chairman Section */}
          <div className="message-column" id="chairman">
            <div className="message-box">
              <h4 className="message-eyebrow">MESSAGE FROM THE CHAIRMAN</h4>
              <h3 className="message-author">Shaykh Professor Mokhtar Ahmad</h3>
              <p className="message-quote">
                "A school is a trust placed in our hands by parents, and before
                them by Allah. At Zaytuna we want every child to leave able to
                read the Book of Allah well, think clearly, speak confidently
                and serve the ummah. We welcome you to visit and walk this path
                with us." <span className="draft-badge">DRAFT</span>
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            3. Why Choose Us? Section (#why-choose-us)
        ========================================= */}
        <div
          className="info-block"
          id="why-choose-us"
          style={{ marginBottom: "50px" }}
        >
          <h2>Why Choose Us?</h2>
          <p style={{ marginBottom: "20px" }}>
            Madrasatuz Zaytuna International offers a unique educational blend
            designed for holistic child development.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#059669",
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                }}
              >
                {" "}
                Dual Curriculum Excellence
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>
                Integration of Cambridge academic standards alongside solid
                Islamic and Arabic foundations.
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#059669",
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                }}
              >
                {" "}
                Language Fluency
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>
                Empowering students to be trilingual in English, Arabic, and
                Bangla for global leadership.
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#059669",
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                }}
              >
                {" "}
                Moral & Tarbiyah Focus
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>
                Nurturing Adab, Akhlaq, and Islamic character alongside rigorous
                academic achievements.
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#059669",
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                }}
              >
                {" "}
                Modern Campus
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#475569" }}>
                State-of-the-art classrooms, media studio, library, computer
                lab, and dedicated Hifz wing.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            4. Community Engagement Section (#community)
        ========================================= */}
        <div
          className="info-block"
          id="community"
          style={{ marginBottom: "50px" }}
        >
          <h2>Community Engagement</h2>
          <p style={{ lineHeight: "1.8", color: "#374151" }}>
            At Madrasatuz Zaytuna International, we believe education extends
            beyond the classroom. We actively engage with parents and the wider
            community through regular parenting sessions, Islamic Halaqahs,
            character development workshops, and social responsibility
            initiatives. Our goal is to build an interconnected ecosystem that
            supports family values and Islamic learning.
          </p>
        </div>

        {/* =========================================
            5. Prospectus 2027 Section (#prospectus)
        ========================================= */}
        <div
          className="info-block"
          id="prospectus"
          style={{
            marginBottom: "50px",
            background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
            color: "#ffffff",
            padding: "35px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2 style={{ color: "#ffffff", marginBottom: "10px" }}>
                Prospectus 2027
              </h2>
              <p style={{ color: "#a7f3d0", margin: 0, fontSize: "1.05rem" }}>
                Download our comprehensive institutional prospectus to explore
                our syllabus, faculty, and campus details.
              </p>
            </div>
            <a
              href="/prospectus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#ffffff",
                color: "#064e3b",
                padding: "12px 25px",
                borderRadius: "8px",
                fontWeight: "bold",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <i className="fa-solid fa-file-pdf"></i> Download Prospectus
            </a>
          </div>
        </div>

        {/* =========================================
            6. Governance & Campus Exploration (#governance, #campus)
        ========================================= */}
        <div className="bottom-feature-grid" id="governance">
          {/* Governance Card */}
          <div className="feature-card">
            <h2>Governance</h2>
            <p className="card-sub-text">Approved organisational structure</p>

            <div className="org-structure">
              <div className="org-box filled">
                <strong>Chairman & Founder</strong>
                <br />
                Professor Mokhtar Ahmad
              </div>
              <div className="org-line"></div>
              <div className="org-box outline">
                <strong>Principal</strong>
                <br />
                Munshi Harun Ar Rashid
              </div>
              <div className="org-line"></div>
              <div className="org-branches">
                <div className="org-box outline split">
                  <strong>Vice Principal</strong>
                  <br />
                  Hafizur Rahman
                </div>
                <div className="org-box outline split">
                  <strong>Admission & Communication Officer</strong>
                  <br />
                  Asif Mostofa
                </div>
              </div>
            </div>
          </div>

          {/* Explore Campus Card */}
          <div className="feature-card" id="campus">
            <h2>Explore the campus</h2>
            <p className="card-sub-text">
              Located in West Dhanmondi Housing, Bosila. Select a floor to
              explore.
            </p>

            <div className="campus-interactive-box">
              <div className="floor-buttons">
                {campusFloors.map((floor) => (
                  <button
                    key={floor.id}
                    className={`floor-btn-modern ${
                      selectedFloor === floor.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedFloor(floor.id)}
                  >
                    <span className="f-num">
                      {floor.id === 0 ? "G" : floor.id}
                    </span>
                    <span className="f-name">{floor.title}</span>
                  </button>
                ))}
              </div>

              <div className="floor-info-display">
                {campusFloors.map((floor) => (
                  <div
                    key={floor.id}
                    className={
                      selectedFloor === floor.id
                        ? "f-detail show"
                        : "f-detail hide"
                    }
                  >
                    <p className="f-label">
                      {floor.id === 0 ? "GROUND FLOOR" : `FLOOR ${floor.id}`}
                    </p>
                    <h3 className="f-title">{floor.title}</h3>
                    <p className="f-desc">{floor.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
