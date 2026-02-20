//src/components/AdminRoute/AdminRoute.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Redirect from "../Redirect";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/api/v1/auth/admin-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      } finally {
        setLoading(false); // চেক শেষ হলে লোডিং ফলস হবে
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      // যদি টোকেনই না থাকে, তবে লোডিং বন্ধ করে রিডাইরেক্টে পাঠাবে
      setLoading(false);
    }
  }, [auth?.token]);

  // ১. যখন টোকেন ভেরিফাই হচ্ছে, তখন শুধু একটি সাদা স্ক্রিন বা ছোট স্পিনার দেখাবে
  if (loading) return null;

  // ২. যদি ভেরিফিকেশন সফল হয় (ok === true), তবে অ্যাডমিন ড্যাশবোর্ড দেখাবে
  // ৩. যদি ব্যর্থ হয়, তবে আপনার বানানো Redirect কম্পোনেন্টটি কল হবে
  return ok ? <Outlet /> : <Redirect path="" />;
};

export default AdminRoute;
