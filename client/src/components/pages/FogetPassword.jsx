import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "./Layout";

// Forgot Password
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        answer,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/login"), 2000);
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
          <h1>Reset Password</h1>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Favorite Sport?"
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Reset Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;