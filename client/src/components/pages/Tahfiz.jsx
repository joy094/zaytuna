//src/components/pages/Tahfiz.jsx

import React from "react";
import Layout from "./Layout";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import "./TahfizPage.css";

const Tahfiz = () => {
  return (
    <Layout title={"Tahfiz Wing - Madrasatuz Zaytuna International"}>
      <div className="tahfiz-modern-wrapper">
        {/* ১. Page Header / Hero Section */}
        <section className="tahfiz-header-section">
          <div className="container-box">
            <p className="breadcrumb-text">Home / Tahfiz Wing</p>
            <h1 className="main-title">
              Memorising the Qur'an without leaving schooling behind
            </h1>
            <p className="main-subtitle">
              An integrated programme on floor 6 for boys aged 6 to 10. Hifz is
              the main work of the day, alongside daily academic periods to keep
              each boy ready to rejoin his age group.
            </p>
          </div>
        </section>

        {/* ২. Main Content Grid */}
        <section className="tahfiz-content-section">
          <div className="container-box">
            <div className="tahfiz-grid">
              {/* Left Column: Requirements & After Hifz */}
              <div className="tahfiz-left-col">
                {/* Entry Requirements */}
                <div className="info-block-clean">
                  <h2 className="section-title">Entry requirements</h2>
                  <ul className="requirements-list">
                    <li>
                      <CheckCircle2 size={20} className="list-icon" />
                      <span>Boys aged 6 to 10</span>
                    </li>
                    <li>
                      <CheckCircle2 size={20} className="list-icon" />
                      <span>
                        Fluent Nazera, checked by the Hifz Ustadh at interview
                      </span>
                    </li>
                    <li>
                      <CheckCircle2 size={20} className="list-icon" />
                      <span>
                        Boys not yet fluent join the main stream and transfer
                        around the end of Grade 1 or 2
                      </span>
                    </li>
                    <li>
                      <CheckCircle2 size={20} className="list-icon" />
                      <span>The same family screening as the main school</span>
                    </li>
                  </ul>
                </div>

                {/* After Hifz */}
                <div className="info-block-clean mt-10">
                  <h2 className="section-title">After hifz</h2>
                  <div className="highlight-box">
                    <BookOpen size={24} className="highlight-icon" />
                    <p>
                      One year of Shunani (complete revision and recitation to
                      the teacher) with academic bridging, then the student
                      joins the grade that matches his age.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: The Tahfiz Day Schedule */}
              <div className="tahfiz-right-col">
                <div className="schedule-card">
                  <div className="schedule-header">
                    <h3>The Tahfiz day</h3>
                    <span className="time-badge">
                      <Clock size={14} /> 6:45 am – 3:00 pm
                    </span>
                  </div>

                  <div className="schedule-list">
                    {/* Row 1 */}
                    <div className="schedule-row">
                      <div className="time-col">6:45 am</div>
                      <div className="task-col">Arrival (Before 6:45 am)</div>
                      <div className="badge-col">
                        <span className="tag-activity">Morning</span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="schedule-row">
                      <div className="time-col">7:00 am</div>
                      <div className="task-col">Hifz classes start</div>
                      <div className="badge-col">
                        <span className="tag-hifz">Hifz</span>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="schedule-row">
                      <div className="time-col">9:00 am</div>
                      <div className="task-col">Breakfast</div>
                      <div className="badge-col">
                        <span className="tag-activity">Meal</span>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="schedule-row">
                      <div className="time-col">12:30 pm</div>
                      <div className="task-col">Zuhr prayer</div>
                      <div className="badge-col">
                        <span className="tag-activity">Prayer</span>
                      </div>
                    </div>

                    {/* Row 5 */}
                    <div className="schedule-row">
                      <div className="time-col">12:40 pm</div>
                      <div className="task-col">Snack</div>
                      <div className="badge-col">
                        <span className="tag-activity">Meal</span>
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div className="schedule-row">
                      <div className="time-col">12:45 pm</div>
                      <div className="task-col">
                        General subjects (Bangla, English, Maths, Science)
                      </div>
                      <div className="badge-col">
                        <span className="tag-academic">Academic</span>
                      </div>
                    </div>

                    {/* Row 7 */}
                    <div className="schedule-row">
                      <div className="time-col">3:00 pm</div>
                      <div className="task-col">Departure</div>
                      <div className="badge-col">
                        <span className="tag-activity">Home</span>
                      </div>
                    </div>
                  </div>

                  <div className="schedule-footer">
                    Hifz classes alongside daily academics. Meals (Breakfast &
                    Snack) provided.
                  </div>
                  <div className="schedule-footer">
                    About six hours of hifz and two hours of academics daily.
                    Meals provided.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Tahfiz;
