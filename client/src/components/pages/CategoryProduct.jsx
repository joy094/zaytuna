//src/components/pages/CategoryProduct.jsx

import React, { useState, useEffect } from "react";
import Layout from "./Layout"; // আপনার লেআউট পাথ অনুযায়ী ঠিক করে নিন
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryProduct.css"; // CSS ফাইল ইম্পোর্ট
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`,
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="category-page-wrapper">
        <div className="container mt-3">
          <h4 className="text-center category-title">
            Category - {category?.name}
          </h4>
          <h6 className="text-center result-count">
            {products?.length} result found
          </h6>

          <div className="product-grid">
            {products?.map((p) => (
              <div className="product-card" key={p._id}>
                <div
                  className="product-img-box"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                  />
                </div>
                <div className="product-info">
                  <h5 className="product-name">{p.name.substring(0, 30)}...</h5>
                  <p className="product-desc">
                    {p.description.substring(0, 40)}...
                  </p>
                  <p className="product-price">৳ {p.price}</p>
                  <div className="card-buttons">
                    <button
                      className="btn-details"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn-add-cart"
                      onClick={() => {
                        // কার্টে পণ্য যোগ করার লজিক
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p]),
                        );
                        toast.success("পণ্যটি কার্টে যোগ করা হয়েছে");
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
