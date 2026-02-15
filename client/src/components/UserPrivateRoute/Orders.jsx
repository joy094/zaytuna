//src/components/UserPrivateRoute/Orders.jsx
import React, { useState, useEffect } from "react";
import { Layout } from "../../App";
import UserMenu from "./UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment"; // সময় সুন্দর দেখানোর জন্য (ইন্সটল না থাকলে npm i moment)

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // ব্যাকএন্ড থেকে অর্ডার ডাটা আনা
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/auth/orders",
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container dashboard-grid">
        <UserMenu />
        <div className="content-area">
          <h1 className="page-title">All Orders</h1>

          {orders?.map((o, i) => (
            <div className="border shadow mb-4 table-wrapper" key={o._id}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <span
                        className={`status-badge ${o?.status?.toLowerCase().replace(" ", "-")}`}
                      >
                        {o?.status}
                      </span>
                    </td>
                    <td>{o?.buyer?.name || "Guest User"}</td>
                    <td>{moment(o?.createdAt).fromNow()}</td>
                    <td>
                      {o?.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Online"}
                    </td>
                    <td>{o?.products?.length} items</td>
                  </tr>
                </tbody>
              </table>

              {/* অর্ডারের ভেতরে থাকা প্রোডাক্টগুলোর ছবি দেখার জন্য */}
              <div className="order-products-list p-3">
                {o?.products?.map((p) => (
                  <div
                    className="cart-item-row"
                    key={p._id}
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    <img
                      src={`http://localhost:3001/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="ms-3">
                      <p className="mb-0">
                        <strong>{p.name}</strong>
                      </p>
                      <p className="mb-0 text-muted">Price: ${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center">No orders found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
