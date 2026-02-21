import React, { useEffect, useState } from "react";
import Layout from "../../components/pages/Layout";
import UserMenu from "./UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";

import e from "cors";

// ৩. User Dashboard
const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div
        className="container dashboard-grid"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        <UserMenu />
        <div
          className="details-card"
          style={{ flex: 1, padding: "20px", border: "1px solid #ddd" }}
        >
          <h1>User Profile</h1>
          <h3>Name: {auth?.user?.name}</h3>
          <h3>Email: {auth?.user?.email}</h3>
          <h3>Address: {auth?.user?.address}</h3>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
