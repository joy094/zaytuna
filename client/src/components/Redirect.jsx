import React, { useState, useEffect } from "react";
 
  import { useNavigate, useLocation, Link } from "react-router-dom";
    
const Redirect = ({path="login"}) => {
      const [count, setCount] = useState(5);
      const navigate = useNavigate();
      const location = useLocation();
       useEffect(() => {
        const intervel = setInterval(() => {
           setCount((prev) => --prev);
         }, 1000);
         count === 0 &&
          navigate(`/${path}`,
             
    
             { state:location.pathname } 
           );
        return () => clearInterval(intervel);
       }, [count, navigate, location, path]);
    
  return (
    <div style={{ textAlign: "center", marginTop: "20px" , padding: "20px" }}>
        <h1 style={{ color: "red" }}>You are not logged in</h1>
        <h1>Redirecting you in login page {count} seconds..</h1>
        <p>If you are not redirected, {<Link to="/login">click</Link> } here</p>
     
    </div>
  )
}

export default Redirect
