// src/main.jsx

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart";
import ScrollToTop from "./components/ScrollToTop";
import { GoogleOAuthProvider } from "@react-oauth/google";

// সরাসরি এখানে আপনার সঠিক Client ID টি বসিয়ে দিন
const GOOGLE_CLIENT_ID =
  "77177855129-b62uk3188027mhu495clbin87f6ljicl.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>,
);
