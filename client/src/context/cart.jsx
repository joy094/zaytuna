
//src/context/cart.jsx
import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // যখনই পেজ লোড হবে, লোকাল স্টোরেজ থেকে কার্টের ডাটা রিড করবে
  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) {
      setCart(JSON.parse(existingCartItem));
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// কাস্টম হুক যাতে সহজে কার্ট ব্যবহার করা যায়
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
