import React, { useState } from "react";
import Layout from "./Layout";
import "./AboutPage.css";

const About = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);

  // ক্লায়েন্টের নির্দেশিত নতুন ফ্লোর ডেটা
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
        {/* Header Section */}
        <div className="zaytuna-page-header">
          <p className="breadcrumb-text">Home / About</p>
          <h1 className="main-title">Madrasatuz Zaytuna International</h1>
          <p
            className="tagline-text"
            style={{
              fontWeight: "bold",
              color: "#059669",
              marginBottom: "15px",
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

        {/* Top Grid: Vision, Mission & Message */}
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
              <h2>Core values</h2>
              <div className="values-container">
                <span className="value-item">العلم · 'Ilm</span>
                <span className="value-item">الإيمان · Iman</span>
                <span className="value-item">الأدب · Adab</span>
                <span className="value-item">العمل · 'Amal</span>
                <span className="value-item">العمران · 'Umran</span>
              </div>
            </div>
          </div>

          {/* Right Side: Message from Head */}
          <div className="message-column">
            <div className="message-box">
              <h4 className="message-eyebrow">FROM THE HEAD OF INSTITUTION</h4>
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

        {/* Bottom Grid: Governance & Campus */}
        <div className="bottom-feature-grid">
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
          <div className="feature-card">
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
                    className={`floor-btn-modern ${selectedFloor === floor.id ? "active" : ""}`}
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
