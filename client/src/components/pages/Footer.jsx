import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* ১. কন্টাক্ট এবং ব্র্যান্ড সেকশন */}
          <div className="footer-widget contact-widget">
            <h2 className="footer-logo">
              Madrasatuz <span>Zaytuna</span>
            </h2>
            <p className="footer-desc">
              Nurturing future leaders with the perfect blend of Islamic morals
              and modern academic excellence in Bangladesh.
            </p>
            <ul className="contact-info">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                
              </li>West Dhanmondi Housing, Bosila, Mohammadpur, Dhaka
              <li>
                <i className="fa-solid fa-phone"></i>
                +8801817141213
              </li>
              <li>
                <i className="fa-brands fa-whatsapp"></i>
                +8801817141213
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                info@madrasatuzzaytuna.com
              </li>
            </ul>
          </div>

          {/* ২. কুইক লিংকস */}
          <div className="footer-widget">
            <h3 className="widget-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/academic-pathways">Academic Pathways</Link>
              </li>
              <li>
                <Link to="/admissions">Admissions</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* ৩. গুরুত্বপূর্ণ পোর্টাল ও পলিসি */}
          <div className="footer-widget">
            <h3 className="widget-title">Important Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/student-portal">Student Portal</Link>
              </li>
              <li>
                <Link to="/parent-portal">Parent Portal</Link>
              </li>
              <li>
                <Link to="/staff-portal">Staff Portal</Link>
              </li>
              <li>
                <Link to="/careers">Careers (Job Application)</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* ৪. নিউজলেটার এবং সোশ্যাল মিডিয়া */}
          <div className="footer-widget">
            <h3 className="widget-title">Stay Updated</h3>
            <p className="newsletter-text">
              Subscribe to our newsletter to receive updates on admissions,
              events, and school announcements.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>

            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ফুটারের নিচের অংশ (কপিরাইট) */}
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright-text">
            &copy; {currentYear}{" "}
            <strong>Madrasatuz Zaytuna International</strong>. All Rights
            Reserved.
          </p>
          <div className="payment-methods">
            {/* মাদ্রাসার জন্য পেমেন্ট আইকনের বদলে অন্য কোনো তথ্য বা সোশ্যাল আইকনও রাখতে পারেন। আপাতত আপনার আগের ডিজাইনের মতই রাখা হলো। */}
            <span>Powered by: </span>
            <strong>MD Jakaria</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
