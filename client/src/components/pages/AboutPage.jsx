import React, { useState } from "react";
import Layout from "./Layout";
import "./AboutPage.css";

const About = () => {
  const [selectedFloor, setSelectedFloor] = useState(2);

  // ছবির হুবহু ফ্লোর ডেটা[cite: 3, 4]
  const campusFloors = [
    { id: 9, title: "Studio", details: "" },
    { id: 8, title: "Conference hall & auditorium", details: "" },
    { id: 7, title: "Tahfiz Wing", details: "" },
    { id: 6, title: "Classrooms & facilities", details: "" },
    { id: 5, title: "Classrooms & facilities", details: "" },
    { id: 4, title: "Classrooms & facilities", details: "" },
    { id: 3, title: "Classrooms & facilities", details: "" },
    {
      id: 2,
      title: "Administration",
      details: "Principal and directors' offices, meeting room.",
    },
    { id: 1, title: "Administration", details: "" },
  ];

  return (
    <Layout title={"About Zaytuna - Madrasatuz Zaytuna International"}>
      <div className="zaytuna-modern-wrapper">
        {/* Header Section (ছবি অনুযায়ী)[cite: 3] */}
        <div className="zaytuna-page-header">
          <p className="breadcrumb-text">Home / About</p>
          <h1 className="main-title">About Zaytuna</h1>
          <p className="main-subtitle">
            The olive tree is named in the Qur'an as blessed: deep-rooted,
            long-living and generous. We want the same for our students: firm
            roots in iman and knowledge, and a life that benefits others.
          </p>
        </div>

        {/* Top Grid: Vision, Mission & Message[cite: 3, 4] */}
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

          {/* Right Side: Message from Head[cite: 3] */}
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

        {/* Bottom Grid: Governance & Campus[cite: 4] */}
        <div className="bottom-feature-grid">
          {/* Governance Card */}
          <div className="feature-card">
            <h2>Governance</h2>
            <p className="card-sub-text">Approved organisational structure</p>

            <div className="org-structure">
              <div className="org-box outline">Advisory Board</div>
              <div className="org-line"></div>
              <div className="org-box filled">Chairman / Founder</div>
              <div className="org-line"></div>
              <div className="org-box outline">Principal</div>
              <div className="org-line"></div>
              <div className="org-branches">
                <div className="org-box outline split">
                  Administrative Director
                </div>
                <div className="org-box outline split">Academic Director</div>
              </div>
            </div>
          </div>

          {/* Explore Campus Card */}
          <div className="feature-card">
            <h2>Explore the campus</h2>
            <p className="card-sub-text">
              Nine storeys in West Dhanmondi Housing, Bosila. Select a floor.
            </p>

            <div className="campus-interactive-box">
              <div className="floor-buttons">
                {campusFloors.map((floor) => (
                  <button
                    key={floor.id}
                    className={`floor-btn-modern ${selectedFloor === floor.id ? "active" : ""}`}
                    onClick={() => setSelectedFloor(floor.id)}
                  >
                    <span className="f-num">{floor.id}</span>
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
                    <p className="f-label">FLOOR {floor.id}</p>
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
