import React from "react";
import Layout from "./Layout";
import "./TarbiyahPage.css";

const Tarbiyah = () => {
  // Core Values Data[cite: 14]
  const coreValues = [
    {
      arabic: "العلم",
      title: "'Ilm · Knowledge",
      desc: "Love of learning; asking questions; reading daily; respecting books and teachers.",
    },
    {
      arabic: "الإيْمان",
      title: "Iman · Faith",
      desc: "Salah on time; remembering Allah; trusting Him in difficulty; truthfulness.",
    },
    {
      arabic: "الأدَب",
      title: "Adab · Manners",
      desc: "Salam, kind speech, respect for parents and elders, cleanliness and order.",
    },
    {
      arabic: "العمل",
      title: "'Amal · Action",
      desc: "Doing what we learn; finishing work well; khidmah in class and at home.",
    },
    {
      arabic: "العُمُران",
      title: "'Umran · Building society",
      desc: "Helping others; caring for the masjid, neighbourhood and environment; serving the ummah.",
    },
  ];

  return (
    <Layout title={"Tarbiyah - Madrasatuz Zaytuna International"}>
      <div className="tarbiyah-page-wrapper">
        {/* 1. Header Section[cite: 14] */}
        <section className="t-header-section">
          <div className="container-box">
            <p className="breadcrumb-text">Home / Tarbiyah</p>
            <h1 className="t-main-title">Tarbiyah: raising the whole child</h1>
            <p className="t-bengali-subtitle">তারবিয়াহ</p>
            <p className="t-main-desc">
              Knowledge without character is incomplete. Tarbiyah at Zaytuna
              shapes how a child prays, speaks, works and treats others, through
              daily practice at school and a close partnership with home.
            </p>
          </div>
        </section>

        {/* 2. Core Values Section[cite: 14] */}
        <section className="t-core-values">
          <div className="container-box">
            <div className="values-grid">
              {coreValues.map((val, index) => (
                <div key={index} className="val-card">
                  <h2 className="arabic-text">{val.arabic}</h2>
                  <h3 className="val-title">{val.title}</h3>
                  <p className="val-desc">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. School Day & Milestones Grid[cite: 15] */}
        <section className="t-middle-section">
          <div className="container-box">
            <div className="t-middle-grid">
              {/* Left Column: Tarbiyah in the school day */}
              <div className="t-card">
                <h3 className="card-heading">Tarbiyah in the school day</h3>

                <div className="routine-list">
                  {[
                    {
                      time: "Morning",
                      task: "Assembly with Qur'an, morning adhkar and a short reminder",
                      badge: "Daily",
                      badgeClass: "green",
                    },
                    {
                      time: "Arrival",
                      task: "Greeting with salam, shoes and bags in order, the Sunnah of entering",
                      badge: "Daily",
                      badgeClass: "green",
                    },
                    {
                      time: "Meals",
                      task: "Du'a before and after eating, eating with the right hand, sharing",
                      badge: "Daily",
                      badgeClass: "green",
                    },
                    {
                      time: "Dhuhr",
                      task: "Wudu and salah in congregation; younger children are taught step by step",
                      badge: "Daily",
                      badgeClass: "green",
                    },
                    {
                      time: "Class duty",
                      task: "Khidmah: keeping the classroom clean and helping others",
                      badge: "Daily",
                      badgeClass: "green",
                    },
                    {
                      time: "Adab lesson",
                      task: "Stories of the Prophets and Companions, manners from the Sunnah",
                      badge: "Weekly",
                      badgeClass: "orange",
                    },
                    {
                      time: "Muhasabah",
                      task: "End-of-week reflection: what went well, what to improve",
                      badge: "Weekly",
                      badgeClass: "orange",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="routine-row">
                      <div className="r-time">{item.time}</div>
                      <div className="r-task">{item.task}</div>
                      <div className="r-badge">
                        <span className={`freq-badge ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Adab Milestones[cite: 15] */}
              <div className="t-card">
                <div className="card-header-flex">
                  <h3 className="card-heading">Adab milestones by stage</h3>
                  <span className="draft-badge">DRAFT</span>
                </div>

                <table className="t-table">
                  <thead>
                    <tr>
                      <th>STAGE</th>
                      <th>CHILDREN LEARN TO...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Play – KG</td>
                      <td>
                        Greet with salam, say du'as for daily actions, share and
                        take turns, begin wudu
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Grades 1 – 2</td>
                      <td>
                        Pray with the jama'ah, respect teachers and elders, keep
                        their space clean, learn short hadith on manners
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Grades 3 – 5</td>
                      <td>
                        Pray on time, be honest in their work, help younger
                        students, speak kindly and control anger
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Grade 6 onward</td>
                      <td>
                        Lead and serve: community projects ('umran), mentoring
                        juniors, regular self-accountability
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Three Philosophy Cards[cite: 16] */}
        <section className="t-philosophy-section">
          <div className="container-box">
            <div className="phil-grid">
              <div className="phil-card">
                <h4>Every class has a murabbi</h4>
                <p>
                  The class teacher guides each child's character as well as
                  their learning, and sends a monthly adab report to parents.
                </p>
              </div>
              <div className="phil-card">
                <h4>Correction with mercy</h4>
                <p>
                  Mistakes are corrected privately and kindly, never by
                  humiliation. Parents are involved early when a pattern
                  appears.
                </p>
              </div>
              <div className="phil-card">
                <h4>Recognising good character</h4>
                <p>
                  Termly Star of Adab awards for children who show the five
                  values, chosen by teachers and peers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Home Partnership[cite: 16] */}
        <section className="t-home-partnership">
          <div className="container-box">
            <div className="home-card">
              <div className="home-header">
                <div>
                  <p className="home-eyebrow">HOME PARTNERSHIP</p>
                  <h3 className="home-title">What families do at home</h3>
                </div>
                <a href="#" className="admission-link">
                  Admission commitments
                </a>
              </div>

              <div className="home-grid">
                <div className="h-item">
                  <h4>Parents' halaqa</h4>
                  <p>
                    A monthly gathering for guardians on raising children with
                    Islamic values.
                  </p>
                </div>
                <div className="h-item">
                  <h4>Screen & device guidance</h4>
                  <p>
                    No video games or personal devices; supervised, limited
                    screens only.
                  </p>
                </div>
                <div className="h-item">
                  <h4>Family Qur'an time</h4>
                  <p>
                    A short daily time to hear the child's Qur'an lesson at
                    home.
                  </p>
                </div>
                <div className="h-item">
                  <h4>Adab checklist</h4>
                  <p>
                    A weekly home checklist in the parent portal, seen by the
                    class teacher.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Tarbiyah;
