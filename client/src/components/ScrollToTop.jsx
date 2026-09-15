import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // যখনই রাউট (URL) চেঞ্জ হবে, উইন্ডো অটোমেটিক উপরে চলে যাবে
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // স্মুথলি উপরে যাওয়ার জন্য
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;