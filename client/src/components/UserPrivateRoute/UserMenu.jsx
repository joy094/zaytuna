// src/components/UserPrivateRoute/UserMenu.jsx

import { NavLink } from "react-router-dom";
import "./UserMenu.css"; // UserMenu এর জন্য আলাদা CSS ফাইল

function UserMenu() {
  return (
    <div className="user-menu-container">
      <div className="list-group">
        {/* User Dashboard কে লিংক বানিয়ে দেওয়া হলো */}
        <NavLink
          to="/dashboard/user"
          className={({ isActive }) =>
            isActive ? "menu-title active" : "menu-title"
          }
          style={{ textDecoration: "none" }}
        >
          User Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          My Profile
        </NavLink>

        {/* যদি ভবিষ্যতে অর্ডার বা অন্য পেজ যোগ করতে চান */}
        {/* <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          My Orders
        </NavLink> */}
      </div>
    </div>
  );
}

export default UserMenu;
