//src/context/auth.jsx
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // ১. ডিফল্ট হেডার সেট করা (এটি রিলোড হওয়ার সাথে সাথে রান করবে)
  // এটি useEffect এর বাইরে রাখা জরুরি যাতে প্রথম রিকোয়েস্টেই টোকেন যায়
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user, // এখানে ...auth দেওয়ার দরকার নেই, সরাসরি অবজেক্ট দিন
        token: parseData.token,
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
