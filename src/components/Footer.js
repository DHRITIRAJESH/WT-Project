import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Personal Finance Tracker | Built with ❤️ by Team</p>
    </footer>
  );
};

export default Footer;
