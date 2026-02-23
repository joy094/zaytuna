//src/components/UserPrivateRoute/Cart.jsx

import React, { useState } from "react";
import Layout from "../../components/pages/Layout";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Cart.css"; // Cart এর জন্য আলাদা CSS ফাইল

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  // Total Price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "BDT",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.info("Item removed from cart");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Order (Guest or Logged In)
  const handleOrder = async () => {
    try {
      const orderData = {
        cart,
        customerDetails: auth?.token
          ? {
              name: auth?.user?.name,
              email: auth?.user?.email,
              phone: auth?.user?.phone,
              address: auth?.user?.address,
            }
          : guestDetails,
      };

      const { data } = await axios.post(
        "/api/v1/product/place-order",
        orderData,
      );

      if (data?.success) {
        setCart([]);
        localStorage.removeItem("cart");

        // সাকসেস টোস্ট
        toast.success("Order Placed Successfully! Returning to Home...");

        // ২ সেকেন্ড পর নেভিগেট হবে যাতে ইউজার মেসেজটি পড়তে পারে
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } else {
        toast.error(data?.message || "Order failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Cart - Checkout"}>
      <div className="cart-page-wrapper">
        <div className="container">
          <div className="cart-header">
            <h1>{`Hello ${auth?.token ? auth?.user?.name : "Guest User"}`}</h1>
            <p>
              {cart?.length
                ? `You have ${cart.length} items in your cart ${
                    auth?.token ? "" : " | please login to track orders"
                  }`
                : " Your Cart Is Empty"}
            </p>
          </div>

          <div className="cart-content-grid">
            {/* Left Side: Cart Items */}
            <div className="cart-items-section">
              {cart?.map((p) => (
                <div className="cart-item-row" key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h3>{p.name}</h3>
                    <p className="price">৳ {p.price}</p>
                    <button
                      className="btn-remove"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Order Summary & Checkout */}
            <div className="cart-summary-section">
              <div className="summary-card">
                <h2>Order Summary</h2>
                <hr />
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span className="total-price">{totalPrice()}</span>
                </div>

                {/* Guest Delivery Form */}
                {!auth?.token && cart.length > 0 && (
                  <div className="guest-checkout-form">
                    <h4>Delivery Details (COD)</h4>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="form-control"
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="form-control"
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                    <textarea
                      placeholder="Full Shipping Address"
                      className="form-control"
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          address: e.target.value,
                        })
                      }
                      required
                    ></textarea>
                  </div>
                )}

                <button
                  className="btn-place-order"
                  onClick={handleOrder}
                  disabled={
                    !auth?.token &&
                    (!guestDetails.name ||
                      !guestDetails.phone ||
                      !guestDetails.address)
                  }
                >
                  Confirm Cash on Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
