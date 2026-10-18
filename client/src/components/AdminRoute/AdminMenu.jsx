// src/components/Admin/AdminMenu.jsx

import { NavLink } from "react-router-dom";
import "./AdminMenu.css";

function AdminMenu() {
  return (
    <div className="admin-menu-container">
      <div className="list-group">
        <h2 className="menu-title">Admin Panel</h2>

        <NavLink
          to="/dashboard/admin/create-notice"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Create Notice
        </NavLink>

        {/* <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Create Product
        </NavLink> */}

        {/* --- এটি অবশ্যই যুক্ত করতে হবে (প্রোডাক্ট এডিট/ডিলিট করার গেটওয়ে) --- */}
        {/* <NavLink
          to="/dashboard/admin/all-applications"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          All Aplications
        </NavLink> */}

        {/* ================= নতুন যুক্ত করা হলো: স্লাইডার ম্যানেজমেন্ট ================= */}
        {/* <NavLink
          to="/dashboard/admin/manage-slider"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Manage Slider
        </NavLink> */}

        <NavLink
          to="/dashboard/admin/manage-applications"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Manage Applications
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Users List
        </NavLink>
      </div>
    </div>
  );
}

export default AdminMenu;
