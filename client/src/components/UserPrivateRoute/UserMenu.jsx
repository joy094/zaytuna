// UserMenu.jsx

import { NavLink } from "react-router-dom";
import "./UserMenu.css"; // UserMenu এর জন্য আলাদা CSS ফাইল

function UserMenu() {
  return (
    <div className="user-menu-container">
      <div className="list-group">
        <h2 className="menu-title">User Dashboard</h2>

        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          My Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          My Orders
        </NavLink>
      </div>
    </div>
  );
}

export default UserMenu;
