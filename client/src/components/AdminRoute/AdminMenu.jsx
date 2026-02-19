import { NavLink } from "react-router-dom";
import "./AdminMenu.css";

function AdminMenu() {
  return (
    <div className="admin-menu-container">
      <div className="list-group">
        <h2 className="menu-title">Admin Panel</h2>

        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Create Product
        </NavLink>

        {/* --- এটি অবশ্যই যুক্ত করতে হবে (প্রোডাক্ট এডিট/ডিলিট করার গেটওয়ে) --- */}
        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          All Products
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Manage Orders
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
