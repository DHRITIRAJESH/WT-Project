import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name);
    }
  }, [location]); // Re-check on location change

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Finance Tracker</div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        <Link to="/expenses" className={location.pathname === "/expenses" ? "active" : ""}>Expenses</Link>
        <Link to="/income" className={location.pathname === "/income" ? "active" : ""}>Income</Link>
        <Link to="/transactions" className={location.pathname === "/transactions" ? "active" : ""}>Transactions</Link>
        <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""}>Reports</Link>
        <Link to="/goals" className={location.pathname === "/goals" ? "active" : ""}>Goals</Link>
        
        {isLoggedIn ? (
          <>
            <span style={{ color: "#8b9bff", fontWeight: "600", marginLeft: "20px" }}>Hi, {userName}</span>
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: "8px 16px", 
                fontSize: "0.95rem",
                background: "linear-gradient(135deg, #eb3349, #f45c43)",
                marginLeft: "10px"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""} style={{ marginLeft: "20px" }}>Login</Link>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
