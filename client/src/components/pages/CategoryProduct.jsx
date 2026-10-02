//src/components/pages/CategoryProduct.jsx

import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryProduct.css";
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
        `/api/v1/product/product-category/${params.slug}`
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
          <h6 className="text-center result-count mb-4">
            {products?.length} result found
          </h6>

          <div className="product-grid">
            {products?.map((p) => (
              <div className="product-card" key={p._id}>
                {/* ইমেজ বক্সের ক্লাস product-img-wrapper করা হলো যাতে ছবি না কাটে */}
                <div
                  className="product-img-wrapper"
                  onClick={() => navigate(`/product/${p.slug}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={p.photo} alt={p.name} />
                </div>
                <div className="product-info">
                  <h5 className="product-name">
                    {p.name.substring(0, 35)}
                    {p.name.length > 35 ? "..." : ""}
                  </h5>

                  <p className="price-tag">৳ {p.price}</p>

                  <div className="card-buttons">
                    <button
                      className="btn-details"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>

                    {/* === ভেরিয়েন্ট লজিক যুক্ত করা হলো === */}
                    {p?.variants && p.variants.length > 0 ? (
                      <button
                        className="btn-add-cart"
                        style={{ backgroundColor: "#495057", borderColor: "#495057", color: "#fff" }} // আলাদা বোঝানোর জন্য ডার্ক কালার দেওয়া হলো
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        Select Options
                      </button>
                    ) : (
                      <button
                        className="btn-add-cart"
                        onClick={() => {
                          const cartItem = {
                            _id: p._id,
                            name: p.name,
                            slug: p.slug,
                            price: p.price,
                            photo: p.photo, // কার্টে ছবি দেখানোর জন্য photo অ্যাড করা হলো
                            selectedVariant: null,
                          };
                          const updatedCart = [...cart, cartItem];
                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart)
                          );
                          toast.success("পণ্যটি কার্টে যোগ করা হয়েছে");
                        }}
                      >
                        Add To Cart
                      </button>
                    )}
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