import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Layout } from "../App"; // আপনার পাথ অনুযায়ী Layout ইমপোর্ট নিশ্চিত করুন

const Redirect = ({ path = "login" }) => {
  const [count, setCount] = useState(5);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setShowError(true);
    }, 2000);

    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);

    if (count === 0) {
      navigate(`/${path}`, { state: location.pathname });
    }

    return () => {
      clearInterval(interval);
      clearTimeout(errorTimeout);
    };
  }, [count, navigate, location, path]);

  return (
    <Layout title="Redirecting...">
      <div
        className="redirect-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {!showError ? (
          <div className="loader-wrapper">
            <div className="spinner-border text-primary" role="status"></div>
            <h2 style={{ marginTop: "15px", color: "#555" }}>
              Checking Authentication...
            </h2>
          </div>
        ) : (
          <div className="animate-top">
            <h1 style={{ color: "#e94560", fontSize: "2rem" }}>
              <i className="fa-solid fa-triangle-exclamation"></i> Access Denied
            </h1>
            <h2 style={{ color: "#333", margin: "15px 0" }}>
              Redirecting to {path} in{" "}
              <span
                className="countdown-text"
                style={{ color: "#e94560", fontWeight: "bold" }}
              >
                {count}
              </span>{" "}
              seconds..
            </h2>
            <p style={{ fontSize: "1.1rem" }}>
              If you are not redirected,{" "}
              <Link
                to={`/${path}`}
                style={{ color: "#0084ff", fontWeight: "bold" }}
              >
                click here
              </Link>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Redirect;
