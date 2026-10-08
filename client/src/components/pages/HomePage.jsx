import React from "react";
import Layout from "./Layout"; // আপনার লেআউট কম্পোনেন্ট
import {
  BookOpen,
  GraduationCap,
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import "./HomePage.css"; // Pure CSS ফাইলটি অবশ্যই ইমপোর্ট রাখবেন

const Home = () => {
  return (
    <Layout title={"Madrasatuz Zaytuna International - Home"}>
      <div className="home-container">
        {/* 1. Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              Rooted in faith. Reaching for excellence.
            </h1>
            <h2 className="hero-subtitle">মাদরাসাতুয যায়তুনা ইন্টারন্যাশনাল</h2>
            <p className="hero-desc">
              Nurturing future leaders with the perfect blend of Islamic morals
              and modern academic excellence.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">
                Apply Now <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary">Discover Pathways</button>
            </div>
          </div>
        </section>

        {/* 2. Arabic Qur'an Verse Section */}
        <section className="verse-section">
          <div className="verse-content">
            <h3 className="verse-arabic" dir="rtl">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </h3>
            <p className="verse-english">
              "Read in the name of your Lord who created"
            </p>
            <p className="verse-bangla">
              "পড়ুন আপনার রবের নামে, যিনি সৃষ্টি করেছেন" (সূরা আলাক: ১)
            </p>
          </div>
        </section>

        {/* 3. Vision & Values Section */}
        <section className="values-section">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
            <div className="title-underline"></div>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <BookOpen size={40} />
              </div>
              <h3 className="value-title">দ্বীনি শিক্ষা (Islamic Knowledge)</h3>
              <p className="value-desc">
                Deep-rooted understanding of Quran, Sunnah, and Islamic Adab.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <GraduationCap size={40} />
              </div>
              <h3 className="value-title">আধুনিক শিক্ষা (Modern Education)</h3>
              <p className="value-desc">
                Cambridge & National Curriculum designed for global competence.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={40} />
              </div>
              <h3 className="value-title">চরিত্র গঠন (Character Building)</h3>
              <p className="value-desc">
                TarBiyah focused on nurturing ethics, discipline, and
                leadership.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Academic Pathway Preview */}
        <section className="pathway-section">
          <div className="pathway-container">
            <div className="pathway-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000&auto=format&fit=crop"
                alt="Students studying"
                className="pathway-image"
              />
            </div>
            <div className="pathway-content">
              <h2 className="section-title" style={{ textAlign: "left" }}>
                Choose Your Pathway
              </h2>
              <p className="pathway-desc">
                আমরা শিক্ষার্থীদের জন্য এমন একটি শিক্ষাব্যবস্থা তৈরি করেছি,
                যেখানে তারা ফাউন্ডেশন কোর্সের পর নিজেদের পছন্দমতো ট্র্যাকে
                পড়াশোনা চালিয়ে যেতে পারবে।
              </p>

              <div className="pathway-list">
                <div className="pathway-item">
                  <div className="pathway-icon icon-emerald">
                    <BookOpen size={24} />
                  </div>
                  <div className="pathway-text">
                    <h4>Integrated Foundation</h4>
                    <p>Play to Class 5 (Basic Islamic + Modern Edu)</p>
                  </div>
                </div>

                <div className="pathway-item">
                  <div className="pathway-icon icon-blue">
                    <GraduationCap size={24} />
                  </div>
                  <div className="pathway-text">
                    <h4>Cambridge Track</h4>
                    <p>O Level & A Level (British Curriculum)</p>
                  </div>
                </div>

                <div className="pathway-item">
                  <div className="pathway-icon icon-amber">
                    <BookOpen size={24} />
                  </div>
                  <div className="pathway-text">
                    <h4>Madrasa Track</h4>
                    <p>Dakhil & Alim (National Curriculum)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Admission CTA & Dates */}
        <section className="admission-section">
          <div className="admission-container">
            <div className="admission-content">
              <h2 className="admission-title">২০২৭ শিক্ষাবর্ষে ভর্তি চলছে!</h2>
              <p className="admission-desc">
                Admissions are now open for the upcoming academic session.
                Secure your child's future in an environment of excellence.
              </p>

              <div className="deadline-box">
                <CalendarDays className="deadline-icon" size={32} />
                <div>
                  <p className="deadline-label">Application Deadline</p>
                  <p className="deadline-date">15 December, 2026</p>
                </div>
              </div>
            </div>

            <div className="admission-form-box">
              <div className="form-card">
                <h4>Ready to Apply?</h4>
                <p>Complete the pre-admission form online.</p>
                <button className="btn btn-apply">Start Application</button>
                <button className="btn-link">View Admission Guide</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
