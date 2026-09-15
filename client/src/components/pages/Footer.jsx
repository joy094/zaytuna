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
              Rupomiq <span>Bd</span>
            </h2>
            <p className="footer-desc">
              Your ultimate destination for premium gadgets, smartphones,
              laptops, and authentic accessories in Bangladesh.
            </p>
            <ul className="contact-info">
              <li>
                <i className="fa-solid fa-location-dot"></i>
              Uttora sector-4 road-2D House-2, Dhaka, Bangladesh, 1230
              </li>
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
                support@rupomiqbd.com
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
                <Link to="/shop">Shop Now</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/blog">Gadget Blog</Link>
              </li>
            </ul>
          </div>

          {/* ৩. কাস্টমার সাপোর্ট */}
          <div className="footer-widget">
            <h3 className="widget-title">Customer Support</h3>
            <ul className="footer-links">
              <li>
                <Link to="/track-order">Track Your Order</Link>
              </li>
              <li>
                <Link to="/return-policy">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/warranty">Warranty Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* ৪. নিউজলেটার এবং সোশ্যাল মিডিয়া */}
          <div className="footer-widget">
            <h3 className="widget-title">Newsletter</h3>
            <p className="newsletter-text">
              Subscribe to get special offers, free giveaways, and amazing deals
              directly in your inbox.
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
              <a href="https://www.facebook.com/profile.php?id=61594049798811" target="_blank" rel="noopener noreferrer">
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

      {/* ফুটারের নিচের অংশ (কপিরাইট এবং পেমেন্ট মেথড) */}
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright-text">
            &copy; {currentYear} <strong>Rupomiq Bd</strong>. All Rights
            Reserved.
          </p>
          <div className="payment-methods">
            <span>We Accept: </span>
            <i className="fa-brands fa-cc-visa"></i>
            <i className="fa-brands fa-cc-mastercard"></i>
            <i className="fa-brands fa-paypal"></i>
            <i className="fa-solid fa-money-bill-wave"></i> {/* COD Icon */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
