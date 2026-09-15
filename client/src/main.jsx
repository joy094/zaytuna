import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart"; // নতুন ইমপোর্ট
import ScrollToTop from "./components/ScrollToTop"; // ScrollToTop Component ইমপোর্ট

// Main React Render
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      

      <BrowserRouter>
        <ScrollToTop /> {/* ScrollToTop Component ব্যবহার */}
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>,
);
