// client/src/components/pages/LoginPage.jsx

import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
// import "./LoginPage.css"; // Custom CSS for LoginPage

// Login page
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res.data.success) {
        toast.success("Login successful");
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        setTimeout(() => navigate(location.state || "/"), 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
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

          {/* === নতুন যুক্ত করা রেজিস্ট্রেশন লিংক === */}
          {/* <div style={{ marginTop: "15px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "0" }}>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{
                  color: "#007bff", // সুন্দর নীল রঙ
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Register Here
              </span>
            </p>
          </div> */}
          {/* ================================== */}
        </form>
      </div>
    </Layout>
  );
};

export default Login;
