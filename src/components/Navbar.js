import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">💰 Finance Tracker</div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        <Link to="/expenses" className={location.pathname === "/expenses" ? "active" : ""}>Expenses</Link>
        <Link to="/income" className={location.pathname === "/income" ? "active" : ""}>Income</Link>
        <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""}>Reports</Link>
        <Link to="/goals" className={location.pathname === "/goals" ? "active" : ""}>Goals</Link>
        <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>Settings</Link>
        <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
