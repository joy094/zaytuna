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
import AdminMenu from "./components/AdminRoute/AdminMenu";
import UserMenu from "./components/UserPrivateRoute/UserMenu";
import Orders from "./components/UserPrivateRoute/Orders";
import AdminOrders from "./components/AdminRoute/AdminOrder";
import Profile from "./components/UserPrivateRoute/Profile";
import CreateCategory from "./components/AdminRoute/CreateCategory";
import CreateProduct from "./components/AdminRoute/CreateProduct";
import Users from "./components/AdminRoute/Users";
import CartPage from "./components/UserPrivateRoute/Cart"; // Cart Page ইমপোর্ট

import ProductDetails from "./components/pages/ProductDetaills"; // Product Details Page ইমপোর্ট

import UpdateProduct from "./components/AdminRoute/UpdateProduct";
import Products from "./components/AdminRoute/Products";

// ================= PAGES =================
// Home Page Updated slider logic

const Home = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // প্রোডাক্ট লোড করার ফাংশন (আগের মতোই)
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) setProducts(data.products);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // স্লাইডার অটো-প্লে লজিক
  useEffect(() => {
    if (products.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) =>
          prev === products.slice(0, 5).length - 1 ? 0 : prev + 1,
        );
      }, 4000);
      return () => clearInterval(slideInterval);
    }
  }, [products]);

  // কার্টে অ্যাড করার কমন ফাংশন
  const handleAddToCart = (p) => {
    setCart([...cart, p]);
    localStorage.setItem("cart", JSON.stringify([...cart, p]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="home-container">
        {/* Pure CSS Slider */}
        <div className="custom-slider">
          {products?.slice(0, 5).map((p, index) => (
            <div
              className={index === currentSlide ? "slide active" : "slide"}
              key={p._id}
            >
              {index === currentSlide && (
                <div className="slider-content">
                  <div className="slider-text">
                    <h1 className="animate-top">{p.name}</h1>
                    <p className="animate-bottom">
                      {p.description.substring(0, 100)}...
                    </p>
                    <h3 style={{ color: "#e94560", marginBottom: "15px" }}>
                      ৳ {p.price}
                    </h3>

                    {/* Shop Now বাটন এখন কার্টে অ্যাড করবে */}
                    <button
                      className="shop-btn"
                      onClick={() => handleAddToCart(p)}
                    >
                      Shop Now
                    </button>
                  </div>
                  <div className="slider-image">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/product/${p.slug}`)} // ছবিতে ক্লিক করলে ডিটেইলসে যাবে
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Slider Dots */}
          <div className="slider-dots">
            {products?.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={i === currentSlide ? "dot active" : "dot"}
                onClick={() => setCurrentSlide(i)}
              ></span>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-section">
          <h2 className="section-title">Latest Products</h2>
          <div className="product-grid">
            {products?.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-img-wrapper">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="price-tag">৳ {p.price}</p>
                  <div className="product-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-cart"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
// Register page
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res.data.success) {
        toast.success("Registration successful");
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
          <h1>Register</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Favorite Sport?"
            required
          />
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

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
        </form>
      </div>
    </Layout>
  );
};

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

// About page
// About Page
const About = () => (
  <Layout>
    <div className="container">
      <h1>About Us</h1>
      <p>Your shop description goes here.</p>
    </div>
  </Layout>
);

// ================= COMPONENTS =================

// ৩. User Dashboard (এটি মিসিং ছিল বলে এরর আসছিল)
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

// ৪. Admin Dashboard
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div
        className="container dashboard-grid"
        style={{ display: "flex", gap: "20px", padding: "20px" }}
      >
        <AdminMenu />
        <div
          className="details-card"
          style={{ flex: 1, padding: "20px", border: "1px solid #ddd" }}
        >
          <h1>Admin Details</h1>
          <h3>Admin Name: {auth?.user?.name}</h3>
          <h3>Admin Email: {auth?.user?.email}</h3>
          <h3>Admin Phone: {auth?.user?.phone}</h3>
        </div>
      </div>
    </Layout>
  );
};

//Header Components

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্ট্যাটাস

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful");
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <div className="logo">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "1.5rem",
            }}
          >
            🛒 Barakahmart
          </Link>
        </div>

        {/* হ্যামবার্গার আইকন বাটন */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${isOpen ? "mobile-active" : ""}`}>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
      
          
          <NavLink
            to="/cart"
            className="cart-nav-link"
            onClick={() => setIsOpen(false)}
          >
            <div className="cart-icon-container">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="cart-badge">{cart?.length}</span>
            </div>
          </NavLink>
          {!auth.user ? (
            <>
              <NavLink to="/register" onClick={() => setIsOpen(false)}>
                Register
              </NavLink>
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
            </>
          ) : (
            <details className="dropdown">
              <summary className="dropdown-title">{auth?.user?.name} ▾</summary>
              <div className="dropdown-content">
                <NavLink
                  onClick={() => setIsOpen(false)}
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                >
                  Dashboard
                </NavLink>
                <Link
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  to="/login"
                  className="logout-link"
                >
                  Logout
                </Link>
              </div>
            </details>
          )}
        </div>
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    <h3>&copy; 2026 Barakahmart - All Rights Reserved</h3>
  </footer>
);


// Layout Component
export const Layout = ({ children, title = "Barakahmart" }) => {
  const [cart] = useCart();
  const [auth] = useAuth();

  return (
    <div className="layout-wrapper">
      <Header />
      
      {/* Floating Social Buttons */}
      <div className="social-float">
        <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noreferrer" className="whatsapp-float">
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://m.me/yourpage" target="_blank" rel="noreferrer" className="fb-float">
          <i className="fa-brands fa-facebook-messenger"></i>
        </a>
      </div>

      <main className="main-content" style={{ minHeight: "80vh" }}>
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="bottom-nav">
        <Link to="/" className="nav-item">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>
        <Link to="/dashboard/user/orders" className="nav-item">
          <i className="fa-solid fa-bag-shopping"></i>
          <span>Orders</span>
        </Link>
        <Link to="/cart" className="nav-item">
          <div className="cart-icon-container">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-badge">{cart?.length}</span>
          </div>
          <span>Cart</span>
        </Link>
        <Link to={auth?.user ? `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}` : "/login"} className="nav-item">
          <i className="fa-solid fa-user"></i>
          <span>Account</span>
        </Link>
      </div>

      <ToastContainer autoClose={2000} />
      <Footer />
    </div>
  );
};
// ================= MAIN APP COMPONENT =================

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/fogot-password" element={<ForgotPassword />} />

    {/* Cart Route (Public Access) */}
    <Route path="/cart" element={<CartPage />} />
    <Route path="/product/:slug" element={<ProductDetails />} />

    {/* User Routes */}
    <Route path="/dashboard" element={<PrivateRoute />}>
      <Route path="user" element={<Dashboard />} />
      <Route path="user/profile" element={<Profile />} />
      <Route path="user/orders" element={<Orders />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/dashboard" element={<AdminRoute />}>
      <Route path="admin" element={<AdminDashboard />} />

      <Route path="admin/create-category" element={<CreateCategory />} />
      <Route path="admin/products" element={<Products />} />
      <Route path="admin/update-product/:slug" element={<UpdateProduct />} />
      <Route path="admin/create-product" element={<CreateProduct />} />
      <Route path="admin/users" element={<Users />} />
      <Route path="admin/orders" element={<AdminOrders />} />
    </Route>

    <Route
      path="*"
      element={
        <div className="container">
          <h1>404 Not Found</h1>
        </div>
      }
    />
  </Routes>
);

export default App;
