// NotfoundPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import Layout from "./pages/Layout";

const NotfoundPage = () => {
  return (
    <Layout title="Page Not Found">
      <div style={styles.container}>
        <h1 style={styles.errorCode}>404</h1>
        <div style={styles.line}></div>
        <h2 style={styles.message}>Page Not Found</h2>
        <p style={styles.description}>
          The link you followed might be broken, or the page may have been
          removed.
        </p>
        <Link to="/" style={styles.button}>
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#333",
    textAlign: "center",
    padding: "0 20px",
  },
  errorCode: {
    fontSize: "8rem",
    fontWeight: "900",
    margin: "0",
    color: "#e0e0e0", // Subtle light grey for the background number
    lineHeight: "1",
  },
  line: {
    width: "50px",
    height: "4px",
    backgroundColor: "#007bff",
    margin: "20px 0",
    borderRadius: "2px",
  },
  message: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  description: {
    fontSize: "1.1rem",
    color: "#666",
    maxWidth: "400px",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
};

export default NotfoundPage;
