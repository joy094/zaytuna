import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context & Hooks
import { useAuth } from "./context/auth";
import { useCart } from "./context/cart";

// Style
import "./App.css";

// Route Guards
import PrivateRoute from "./components/UserPrivateRoute/privateRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";

// Components & Pages

import Home from "./components/pages/HomePage";
import About from "./components/pages/AboutPage";
import Contact from "./components/pages/Contact";
import Academic from "./components/pages/AcademicPage";
import Tahfiz from "./components/pages/Tahfiz";
import Tarbiyah from "./components/pages/Tarbiyah";
import Addmission from "./components/pages/Addmission";
import Register from "./components/pages/RegisterPage";
import Login from "./components/pages/LoginPage";
import Notice from "./components/pages/Notice";
import ManageNotices from "./components/AdminRoute/ManageNotices";
import Dashboard from "./components/UserPrivateRoute/UserDashboard";
import AdminDashboard from "./components/AdminRoute/AdminDashboard";
import Search from "./components/pages/Search";
import NotfoundPage from "./components/NotfoundPage";
import ForgotPassword from "./components/pages/FogetPassword";
import Layout from "./components/pages/Layout";

import AdminMenu from "./components/AdminRoute/AdminMenu";
import UserMenu from "./components/UserPrivateRoute/UserMenu";

import AdminLayout from "./components/AdminRoute/AdminLayout"; // আপনার ফোল্ডার পাথ অনুযায়ী
import ManageApplications from "./components/AdminRoute/ManageApplication"; // Import the ManageApplications component
import Orders from "./components/UserPrivateRoute/Orders";
import AdminOrders from "./components/AdminRoute/AdminOrder";
import Profile from "./components/UserPrivateRoute/Profile";
import CreateNotice from "./components/AdminRoute/CreateNotice";
import CreateProduct from "./components/AdminRoute/CreateProduct";
import Users from "./components/AdminRoute/Users";
import CartPage from "./components/UserPrivateRoute/Cart"; // Cart Page ইমপোর্ট

import UpdateProduct from "./components/AdminRoute/UpdateProduct";
import Products from "./components/AdminRoute/Products";

import ScrollToTop from "./components/ScrollToTop"; // ScrollToTop Component ইমপোর্ট
import ManageSlider from "./components/AdminRoute/ManageSlider"; // পাথ ঠিক করে ইম্পোর্ট করুন

// ================= PAGES =================

// ================= MAIN APP COMPONENT =================

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/academic" element={<Academic />} />
    <Route path="/tahfiz" element={<Tahfiz />} />
    <Route path="/tarbiyah" element={<Tarbiyah />} />
    <Route path="/admissions" element={<Addmission />} />
    <Route path="/notice" element={<Notice />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/fogot-password" element={<ForgotPassword />} />
    <Route path="/search/:keyword" element={<Search />} />

    {/* Cart Route (Public Access) */}
    <Route path="/cart" element={<CartPage />} />

    {/* User Routes */}
    <Route path="/dashboard" element={<PrivateRoute />}>
      <Route path="user" element={<Dashboard />} />
      <Route path="user/profile" element={<Profile />} />
      <Route path="user/orders" element={<Orders />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/dashboard" element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="admin" element={<AdminDashboard />} />
        <Route
          path="admin/manage-applications"
          element={<ManageApplications />}
        />
        <Route path="admin/manage-notices" element={<ManageNotices />} />

        <Route path="admin/create-notice" element={<CreateNotice />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/update-product/:slug" element={<UpdateProduct />} />
        <Route path="admin/create-product" element={<CreateProduct />} />
        <Route path="admin/users" element={<Users />} />
        <Route path="admin/orders" element={<AdminOrders />} />
        <Route path="admin/manage-slider" element={<ManageSlider />} />
      </Route>
    </Route>

    <Route path="*" element={<NotfoundPage />} />
  </Routes>
);

export default App;
