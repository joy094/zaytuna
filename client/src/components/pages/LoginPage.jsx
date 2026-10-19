// client/src/components/pages/LoginPage.jsx

import React, { useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { GoogleLogin } from "@react-oauth/google"; // 🔴 GoogleLogin ইমপোর্ট করা হলো
// import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  // ১. ম্যানুয়াল (ইমেইল ও পাসওয়ার্ড) লগইন হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res.data?.success) {
        toast.success("Login successful");
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        setTimeout(() => navigate(location.state || "/"), 1000);
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ২. গুগল অথেন্টিকেশন হ্যান্ডলার (Google Auth Login Logic)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // গুগলের credential (ID Token) ব্যাকএন্ডে পাঠানো হচ্ছে
      const res = await axios.post("/api/v1/auth/google-login", {
        idToken: credentialResponse.credential,
      });

      if (res.data?.success) {
        toast.success("Google Login successful!");
        // অ্থ কন্টেক্সট এবং লোকাল স্টোরেজে তথ্য সেভ করা
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        
        // ব্যবহারকারীকে আগের পেজে বা হোম পেজে রিডাইরেক্ট করা
        navigate(location.state || "/");
      } else {
        toast.error(res.data?.message || "Google Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google Login failed");
    }
  };

  return (
    <Layout title="Login - Madrasatuz Zaytuna">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="btn-primary">
            Login
          </button>

          <button
            type="button"
            className="btn-link"
            onClick={() => navigate("/fogot-password")}
          >
            Forgot Password?
          </button>

          {/* OR Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* =========================================
              Google Login Component
          ========================================= */}
          <div
            className="google-btn-wrapper"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Sign-In was unsuccessful")}
              useOneTap
            />
          </div>
          {/* ========================================= */}

          {/* রেজিস্ট্রেশন লিংক */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "0" }}>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{
                  color: "#059669",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Register Here
              </span>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;