//src/components/UserPrivateRoute/privateRoute.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Redirect from "../Redirect";
import { set } from "mongoose";

// User private route component

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        "/api/v1/auth/user-auth"
      );
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  //চেক করবে যদি প্রাইভেট রাউটের রেসপন্স Ok থাকে তাহলে<Outlet /> কল হবে,,<Outlet />
  //   কল হলেই রাউট থেকে নেস্টেড <Redirect />; রাউট রেন্ডার হবে।
  return ok ? <Outlet /> : <Redirect />;
};
export default PrivateRoute;
