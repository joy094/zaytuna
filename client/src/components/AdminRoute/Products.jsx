import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import Layout from "../../components/pages/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  // সব প্রোডাক্ট আনার ফাংশন
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // লাইফসাইকেল মেথড
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"All Products - Admin Dashboard"}>
      <div className="container dashboard-grid">
        <AdminMenu />
        <div className="content-area">
          <h1 className="page-title">All Products List ({products.length})</h1>
          <div className="admin-product-grid">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/update-product/${p.slug}`}
                className="admin-product-link"
              >
                <div className="admin-product-card">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                  />
                  <div className="admin-product-info">
                    <h5 className="admin-product-name">{p.name}</h5>
                    <p className="admin-product-desc">
                      {p.description.substring(0, 60)}...
                    </p>
                    <p className="admin-product-price">৳ {p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
