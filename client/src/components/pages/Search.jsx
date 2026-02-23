import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const LiveSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();

  // টাইপ করার সাথে সাথে ডাটা আনা
  useEffect(() => {
    const fetchResults = async () => {
      if (keyword.trim().length > 1) {
        try {
          const { data } = await axios.get(`/api/v1/product/search/${keyword}`);

          // আপনার JSON অনুযায়ী data.products সেট করতে হবে
          if (data?.success) {
            setResults(data.products);
            setIsOpen(true);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.log("Search Error:", error);
          setResults([]);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => fetchResults(), 300); // Debouncing
    return () => clearTimeout(timer);
  }, [keyword]);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হওয়া
  useEffect(() => {
    const handler = (e) => {
      // searchRef.current চেক করে নিলে এরর আসবে না
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="search-box-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          placeholder="পণ্য খুঁজুন..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() =>
            keyword.length > 1 && results.length > 0 && setIsOpen(true)
          }
        />
        {keyword && (
          <i
            className="fa-solid fa-xmark clear-icon"
            onClick={() => {
              setKeyword("");
              setResults([]);
            }}
          ></i>
        )}
      </div>

      {/* রেজাল্ট ড্রপডাউন */}
      {isOpen && results.length > 0 && (
        <div className="search-suggestions">
          {results.map((p) => (
            <div
              key={p._id}
              className="suggestion-item"
              onMouseDown={(e) => {
                // অন-ক্লিক এর বদলে অন-মাউস-ডাউন অনেক সময় বেশি কার্যকরী হয়
                e.preventDefault();
                navigate(`/product/${p.slug}`);
                setIsOpen(false);
                setKeyword("");
              }}
            >
              <div className="suggestion-img">
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                />
              </div>
              <div className="suggestion-info">
                <p className="p-name">{p.name}</p>
                <p className="p-price">৳ {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSearch;
