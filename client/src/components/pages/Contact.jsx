// src/components/pages/Contact.jsx
import React, { useState } from "react";
import Layout from "../../components/pages/Layout";
import { toast } from "react-toastify";
import "./Contact.css"; // CSS ফাইল ইমপোর্ট করা হলো

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // এখানে ব্যাকএন্ডে মেসেজ পাঠানোর API যুক্ত করতে পারবেন
    toast.success("Message sent successfully! We will contact you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout title={"Contact Us - Madrasatuz Zaytuna"}>
      <div className="contact-page-wrapper">
        {/* Page Header */}
        <div className="contact-page-header">
          <h1>Get in Touch</h1>
          <p>Have any questions? We'd love to hear from you.</p>
        </div>

        <div className="contact-container">
          {/* ============ Left Side: Contact Info ============ */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="info-desc">
              Reach out to us using the contact details below or drop us a
              message.
            </p>

            <div className="info-cards">
              {/* Phone */}
              <div className="info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div className="info-text">
                  <h3>Call Us</h3>
                  <a href="tel:+8801841515454">+880 1841-515454</a>
                </div>
              </div>

              {/* Email */}
              <div className="info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-envelope-open-text"></i>
                </div>
                <div className="info-text">
                  <h3>Email Us</h3>
                  <a href="mailto:madrasatuzzaytuna.info@gmail.com">
                    madrasatuzzaytuna.info@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="info-card">
                <div className="info-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="info-text">
                  <h3>Visit Us</h3>
                  <p>Madrasatuz Zaytuna, Dhaka, Bangladesh</p>
                  <a
                    href="https://maps.app.goo.gl/Dwcptyx3B73A6PmH9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link-btn"
                  >
                    Open in Google Maps{" "}
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/share/1F2rmdd6tH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon fb"
                  title="Facebook"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                  
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon insta"
                  title="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon yt"
                  title="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* ============ Right Side: Contact Form ============ */}
          <div className="contact-form-section">
            <div className="form-box">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
