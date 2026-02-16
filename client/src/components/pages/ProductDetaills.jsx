import React, { useState, useEffect } from "react";
import { Layout } from "../../App"; // আপনার পাথ অনুযায়ী Layout ইমপোর্ট করুন
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";

import { toast } from "react-toastify";
import "./ProductDetails.css"; // আপনার স্টাইল ফাইল পাথ অনুযায়ী ইমপোর্ট করুন

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart();

  // প্রোডাক্টের বিস্তারিত তথ্য আনার ফাংশন
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching product details");
    }
  };

  // পেজ লোড হলে এবং স্লাগ পরিবর্তন হলে ডাটা ফেচ করবে
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  return (
    <Layout title={`${product.name || "Product Details"} - E-Shop`}>
      <div className="container product-details-page">
        <div className="details-grid">
          {/* বাম পাশে প্রোডাক্টের ইমেজ */}
          <div className="details-img">
            {product._id && (
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                alt={product.name}
              />
            )}
          </div>

          {/* ডান পাশে প্রোডাক্টের তথ্য */}
          <div className="details-info">
            <h1 className="details-title">{product.name}</h1>
            <p className="details-category">
              Category: <b>{product?.category?.name}</b>
            </p>
            <hr />
            <div className="details-price">৳ {product.price}</div>
            <div className="details-description">
              <h4>Product Description:</h4>
              <p>{product.description}</p>
            </div>

            <button
              className="btn-cart-large"
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product]),
                );
                toast.success("Item Added to cart");
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
