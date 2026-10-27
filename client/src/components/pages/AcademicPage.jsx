// AcademicPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import { ArrowRight } from "lucide-react";
import "./AcademicPage.css";

const Academic = () => {
  const { hash } = useLocation();

  // 🔴 হেডার মেনু থেকে হ্যাস-লিংকে (#foundation, #pathway, #calendar) ক্লিক করলে অটো স্ক্রল করার লজিক
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

  // Pathway Planner State
  const [childName, setChildName] = useState("Maryam");
  const [dob, setDob] = useState("2020-08-14");
  const [gender, setGender] = useState("Girl");
  const [selectedPathway, setSelectedPathway] = useState("Undecided");

  // Dynamic Table Data Logic based on Pathway Selection
  const getTableData = () => {
    const foundation = [
      {
        year: 2027,
        grade: "Grade 1",
        stage: "Integrated foundation · 50 : 50",
        milestone: "Formal schooling begins",
      },
      {
        year: 2028,
        grade: "Grade 2",
        stage: "Integrated foundation · 50 : 50",
        milestone: "",
      },
      {
        year: 2029,
        grade: "Grade 3",
        stage: "Integrated foundation · 50 : 50",
        milestone: "",
      },
      {
        year: 2030,
        grade: "Grade 4",
        stage: "Integrated foundation · 50 : 50",
        milestone: "",
      },
      {
        year: 2031,
        grade: "Grade 5",
        stage: "Integrated foundation · 50 : 50",
        milestone: "Pathway decision",
      },
    ];

    let stream = [];
    if (selectedPathway === "Cambridge") {
      stream = [
        {
          year: 2032,
          grade: "Grade 6",
          stage: "Stream preparation · 70 : 30 general to Islamic",
          milestone: "",
        },
        {
          year: 2033,
          grade: "Grade 7",
          stage: "Stream preparation · 70 : 30 general to Islamic",
          milestone: "",
        },
        {
          year: 2034,
          grade: "Grade 8",
          stage: "Stream preparation · 70 : 30 general to Islamic",
          milestone: "",
        },
        {
          year: 2035,
          grade: "Grade 9",
          stage: "Examination stage · IGCSE / O Level",
          milestone: "",
        },
        {
          year: 2036,
          grade: "Grade 10",
          stage: "Examination stage · IGCSE / O Level",
          milestone: "O Level Exams",
        },
        {
          year: 2037,
          grade: "Grade 11",
          stage: "Examination stage · A Level",
          milestone: "",
        },
        {
          year: 2038,
          grade: "Grade 12",
          stage: "Examination stage · A Level",
          milestone: "A Level Exams",
        },
      ];
    } else if (selectedPathway === "Madrasa") {
      stream = [
        {
          year: 2032,
          grade: "Grade 6",
          stage: "Stream preparation · 70 : 30 Islamic to general",
          milestone: "",
        },
        {
          year: 2033,
          grade: "Grade 7",
          stage: "Stream preparation · 70 : 30 Islamic to general",
          milestone: "",
        },
        {
          year: 2034,
          grade: "Grade 8",
          stage: "Stream preparation · 70 : 30 Islamic to general",
          milestone: "",
        },
        {
          year: 2035,
          grade: "Grade 9",
          stage: "Examination stage · Dakhil",
          milestone: "",
        },
        {
          year: 2036,
          grade: "Grade 10",
          stage: "Examination stage · Dakhil",
          milestone: "Dakhil Exams",
        },
        {
          year: 2037,
          grade: "Grade 11",
          stage: "Examination stage · Alim",
          milestone: "",
        },
        {
          year: 2038,
          grade: "Grade 12",
          stage: "Examination stage · Alim",
          milestone: "Alim Exams",
        },
      ];
    } else {
      stream = [
        {
          year: 2032,
          grade: "Grade 6",
          stage: "Stream preparation · 70 : 30",
          milestone: "",
        },
        {
          year: 2033,
          grade: "Grade 7",
          stage: "Stream preparation · 70 : 30",
          milestone: "",
        },
        {
          year: 2034,
          grade: "Grade 8",
          stage: "Stream preparation · 70 : 30",
          milestone: "",
        },
        {
          year: 2035,
          grade: "Grade 9",
          stage: "Examination stage · 70 : 30",
          milestone: "",
        },
        {
          year: 2036,
          grade: "Grade 10",
          stage: "Examination stage · 70 : 30",
          milestone: "Dakhil or O Level",
        },
        {
          year: 2037,
          grade: "Grade 11",
          stage: "Examination stage · 70 : 30",
          milestone: "",
        },
        {
          year: 2038,
          grade: "Grade 12",
          stage: "Examination stage · 70 : 30",
          milestone: "Alim or A Level",
        },
      ];
    }

    return [...foundation, ...stream];
  };

  const currentData = getTableData();

  return (
    <Layout title={"Academic Pathways - Madrasatuz Zaytuna International"}>
      <div className="academic-modern-wrapper">
        {/* ১. Hero Section (#overview) */}
        <section className="academic-hero" id="overview">
          <div className="container-box text-center">
            <h1 className="aca-hero-title">
              Two educational pathways, one integrated foundation
            </h1>
            <p className="aca-hero-subtitle">
              Every child builds the same foundation first. The pathway is
              chosen before Grade 6, after six years of observation and guidance
              from teachers.
            </p>
          </div>
        </section>

        {/* ২. Three Main Educational Stages (#foundation) */}
        <section className="educational-stages" id="foundation">
          <div className="container-box">
            <div className="stages-grid">
              <div className="stage-card">
                <span className="stage-badge">Play - Grade 5</span>
                <h3>Integrated foundation</h3>
                <div className="progress-bar">
                  <div className="bar islamic" style={{ width: "50%" }}>
                    Islamic 50%
                  </div>
                  <div className="bar general" style={{ width: "50%" }}>
                    General 50%
                  </div>
                </div>
                <p>
                  Qur'an (Nazera, Tajwid, memorisation), Arabic, Islamic
                  Studies, Hadith and du'a - English, Bangla, Mathematics,
                  Science, ICT, Art, Physical Education.
                </p>
              </div>

              <div className="stage-card">
                <span className="stage-badge">Grades 6 - 8</span>
                <h3>Stream preparation</h3>
                <div className="progress-bar single">
                  <div className="bar stream">
                    70 : 30 toward the chosen pathway
                  </div>
                </div>
                <p>
                  Madrasa stream: Nahw, Sarf, Fiqh, Hadith, Tafsir with core
                  general subjects. Cambridge stream: Lower Secondary English,
                  Maths, Science, ICT with Qur'an and Islamic Studies
                  maintained.
                </p>
              </div>

              <div className="stage-card">
                <span className="stage-badge">Grades 9 - 12</span>
                <h3>Examination stage</h3>
                <div className="exam-badges">
                  <span className="badge-outline green">Dakhil - Alim</span>
                  <span className="badge-outline orange">
                    IGCSE / O Level - A Level
                  </span>
                </div>
                <p>
                  Public examinations with the Bangladesh Madrasah Education
                  Board (Dakhil at Grade 10, Alim at Grade 12) or Cambridge
                  International.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ৩. The Full Pathway Flowchart (#pathway) */}
        <section className="full-pathway-section" id="pathway">
          <div className="container-box">
            <h2 className="section-heading">The full pathway</h2>

            <div className="pathway-tree">
              <div className="tree-box foundation-box">
                <div className="box-header-flex">
                  <h4>Integrated Foundation · Play to Grade 5</h4>
                  <span className="ratio-text">50 : 50</span>
                </div>
                <div className="grades-row">
                  {[
                    "Play",
                    "Nursery",
                    "KG 1",
                    "KG 2",
                    "Grade 1",
                    "Grade 2",
                    "Grade 3",
                    "Grade 4",
                    "Grade 5",
                  ].map((grade) => (
                    <span key={grade} className="grade-pill">
                      {grade}
                    </span>
                  ))}
                </div>
                <p className="box-note">
                  Play to Grade 2 open in 2027. Each higher grade opens as the
                  founding cohort moves up.
                </p>
              </div>

              <div className="tree-connector-split"></div>

              <div className="tree-branches-grid">
                <div className="branch-column">
                  <div className="tree-box madrasa-box">
                    <span className="grade-eyebrow">GRADES 6–8</span>
                    <h4>Madrasa pathway</h4>
                    <p>70 : 30 Islamic to general</p>
                  </div>
                  <div className="tree-box madrasa-box">
                    <span className="grade-eyebrow">GRADES 9–10</span>
                    <h4>Dakhil</h4>
                    <p>Board examination, SSC equivalent</p>
                  </div>
                  <div className="tree-box madrasa-box">
                    <span className="grade-eyebrow">GRADES 11–12</span>
                    <h4>Alim</h4>
                    <p>
                      Board examination, HSC equivalent → university Honours, or
                      Fazil and Kamil
                    </p>
                  </div>
                </div>

                <div className="branch-column">
                  <div className="tree-box cambridge-box">
                    <span className="grade-eyebrow">GRADES 6–8</span>
                    <h4>Cambridge pathway</h4>
                    <p>70 : 30 general to Islamic</p>
                  </div>
                  <div className="tree-box cambridge-box">
                    <span className="grade-eyebrow">GRADES 9–10</span>
                    <h4>IGCSE / O Level</h4>
                    <p>Cambridge International examinations</p>
                  </div>
                  <div className="tree-box cambridge-box">
                    <span className="grade-eyebrow">GRADES 11–12</span>
                    <h4>A Level</h4>
                    <p>AS and A Level → universities at home and abroad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tahfiz Wing */}
            <div className="tahfiz-wing-box">
              <div className="box-header-flex">
                <h4>Tahfiz Wing · boys aged 6–10</h4>
                <a href="/tahfiz" className="details-link">
                  Details
                </a>
              </div>
              <div className="tahfiz-flow">
                <span className="flow-step">Main stream to Grade 1–2</span>
                <ArrowRight size={16} className="flow-arrow" />
                <span className="flow-step">
                  Full-time hifz + 2 h academics
                </span>
                <ArrowRight size={16} className="flow-arrow" />
                <span className="flow-step">1-year Shunani & bridging</span>
                <ArrowRight size={16} className="flow-arrow" />
                <span className="flow-step">Rejoins age-appropriate grade</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pathway Planner Section (আগের মতোই থাকবে) */}
        <section className="pathway-planner-section">
          <div className="container-box">
            <p className="eyebrow-text">PATHWAY PLANNER</p>
            <h2 className="section-heading mb-6">
              See your child's journey year by year
            </h2>

            <div className="planner-grid">
              {/* Form Column */}
              <div className="planner-form-card">
                <div className="form-group">
                  <label>Child's first name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Maryam"
                  />
                </div>

                <div className="form-group">
                  <label>Date of birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Girl">Girl</option>
                    <option value="Boy">Boy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Pathway from Grade 6</label>
                  <select
                    value={selectedPathway}
                    onChange={(e) => setSelectedPathway(e.target.value)}
                  >
                    <option value="Undecided">Not decided yet</option>
                    <option value="Cambridge">
                      Cambridge (IGCSE/O - A Level)
                    </option>
                    <option value="Madrasa">Madrasa (Dakhil - Alim)</option>
                  </select>
                  <p className="form-note">
                    For planning only. The decision is made during Grade 5.
                  </p>
                </div>
              </div>

              {/* Display Column */}
              <div className="planner-display-card">
                <div className="display-header">
                  <h3>{childName || "Child"}'s pathway</h3>
                  <span
                    className={`pathway-badge ${selectedPathway.toLowerCase()}`}
                  >
                    {selectedPathway === "Undecided"
                      ? "Undecided"
                      : selectedPathway}
                  </span>
                </div>

                <div className="summary-boxes">
                  <div className="s-box">
                    <h4>Grade 1</h4>
                    <p>Starts in 2027</p>
                  </div>
                  <div className="s-box">
                    <h4>2031</h4>
                    <p>Pathway decision</p>
                  </div>
                  <div className="s-box">
                    <h4>2036</h4>
                    <p>
                      {selectedPathway === "Cambridge"
                        ? "IGCSE / O Level"
                        : selectedPathway === "Madrasa"
                          ? "Dakhil"
                          : "IGCSE/O Level or Dakhil"}
                    </p>
                  </div>
                  <div className="s-box">
                    <h4>2038</h4>
                    <p>
                      {selectedPathway === "Cambridge"
                        ? "A Level"
                        : selectedPathway === "Madrasa"
                          ? "Alim"
                          : "A Level or Alim"}
                    </p>
                  </div>
                </div>

                <div className="timeline-scroll">
                  {currentData.slice(0, 11).map((item) => (
                    <div
                      key={item.year}
                      className={`timeline-node ${item.year <= 2031 ? "foundation" : selectedPathway.toLowerCase()}`}
                    >
                      <strong>{item.year}</strong>
                      <span>{item.grade.replace("Grade ", "G")}</span>
                    </div>
                  ))}
                </div>

                <div className="timeline-legend">
                  <span>
                    <div className="legend-dot foundation"></div> Foundation
                  </span>
                  <span>
                    <div className="legend-dot madrasa"></div> Madrasa
                  </span>
                  <span>
                    <div className="legend-dot cambridge"></div> Cambridge
                  </span>
                  <span>
                    <div className="legend-dot tahfiz"></div> Tahfiz
                  </span>
                  <span>
                    <div className="legend-dot milestone"></div> Milestone
                  </span>
                </div>

                <div className="planner-table-wrapper">
                  <table className="planner-table">
                    <thead>
                      <tr>
                        <th>YEAR</th>
                        <th>CLASS</th>
                        <th>STAGE</th>
                        <th>MILESTONE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.year}</td>
                          <td>{row.grade}</td>
                          <td>{row.stage}</td>
                          <td className="fw-bold">{row.milestone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ৪. School Day & Assessment */}
        <section className="routine-assessment-section">
          <div className="container-box">
            <div className="ra-grid">
              <div className="info-card">
                <div className="card-header-flex">
                  <div>
                    <h3 className="card-title">A school day · Grade 1</h3>
                    <p className="card-subtitle">
                      Class time: 8:30 am – 2:00 pm
                    </p>
                  </div>
                  <span className="draft-badge">SAMPLE</span>
                </div>

                <div className="routine-list">
                  {[
                    {
                      time: "8:30",
                      subject: "Assembly, Qur'an recitation and du'a",
                    },
                    { time: "8:50", subject: "Qur'an - Nazera & Tajwid" },
                    { time: "9:30", subject: "English" },
                    { time: "10:10", subject: "Mathematics" },
                    { time: "10:50", subject: "Break" },
                    { time: "11:10", subject: "Arabic" },
                    { time: "11:50", subject: "Bangla & Islamic Studies" },
                    { time: "12:30", subject: "Zuhr in congregation & lunch" },
                    { time: "1:20", subject: "Science / Art / PE" },
                    { time: "2:00", subject: "Dismissal" },
                  ].map((item, index) => (
                    <div key={index} className="routine-item">
                      <span className="time">{item.time}</span>
                      <span className="subject">{item.subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="info-card">
                <h3 className="card-title mb-4">Assessment & reporting</h3>
                <p className="card-desc mb-6">
                  The foundation years use descriptive reports, not ranks. Each
                  area is marked <strong>Exceeding, Secure</strong> or{" "}
                  <strong>Developing</strong>, with comments on adab and Qur'an
                  progress.
                </p>

                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>WHEN</th>
                      <th>GUARDIANS RECEIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Weekly</td>
                      <td>
                        Homework and Qur'an lesson notes in the parent portal
                      </td>
                    </tr>
                    <tr>
                      <td>April</td>
                      <td>Term 1 report and guardian-teacher meeting</td>
                    </tr>
                    <tr>
                      <td>June</td>
                      <td>Mid-year assessment report</td>
                    </tr>
                    <tr>
                      <td>December</td>
                      <td>
                        Annual report, promotion and Qur'an milestone record
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ৫. Academic Calendar (#calendar) */}
        <section className="calendar-section" id="calendar">
          <div className="container-box">
            <div className="info-card calendar-card">
              <div className="card-header-flex">
                <div>
                  <p className="eyebrow-text">ACADEMIC CALENDAR</p>
                  <h3 className="card-title">
                    First Session · Starts January 2027
                  </h3>
                  <p className="card-subtitle">
                    From July 2027, the school transitions to a July–June
                    academic year.
                    <br />
                    Islamic dates depend on moon sighting in Bangladesh.
                  </p>
                </div>
                <span className="draft-badge">TENTATIVE</span>
              </div>

              <div className="calendar-list">
                {[
                  {
                    date: "3 Jan",
                    event: "First day of Session 2027",
                    type: "Academic",
                    typeClass: "bg-green",
                  },
                  {
                    date: "~8 Feb",
                    event: "Ramadan 1448 begins; shorter school hours",
                    type: "Islamic",
                    typeClass: "bg-orange",
                  },
                  {
                    date: "21 Feb",
                    event: "International Mother Language Day",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "~9–14 Mar",
                    event: "Eid al-Fitr holidays",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "26 Mar",
                    event: "Independence Day",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "Apr",
                    event: "Term 1 reports and guardian meetings",
                    type: "Academic",
                    typeClass: "bg-green",
                  },
                  {
                    date: "14 Apr",
                    event: "Pohela Boishakh",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "~14–20 May",
                    event: "Eid al-Adha holidays",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "Jun",
                    event: "Mid-year assessments",
                    type: "Academic",
                    typeClass: "bg-green",
                  },
                  {
                    date: "Aug",
                    event: "Annual Qur'an recitation competition",
                    type: "Events",
                    typeClass: "bg-gray",
                  },
                  {
                    date: "Nov",
                    event: "Annual assessments",
                    type: "Academic",
                    typeClass: "bg-green",
                  },
                  {
                    date: "16 Dec",
                    event: "Victory Day",
                    type: "Holiday",
                    typeClass: "bg-red",
                  },
                  {
                    date: "Dec",
                    event: "Results and prize-giving",
                    type: "Events",
                    typeClass: "bg-gray",
                  },
                ].map((item, index) => (
                  <div key={index} className="calendar-item">
                    <span className="cal-date">{item.date}</span>
                    <span className="cal-event">{item.event}</span>
                    <span className={`cal-badge ${item.typeClass}`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Academic;
