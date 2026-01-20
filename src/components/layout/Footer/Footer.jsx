import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-bottom">
          <p className="footer-text">
            &copy; {currentYear} Dashboard Monitoring Kualitas Udara. All Rights Reserved.
          </p>
          <p className="footer-subtext">
            Developed by Rezzadty for Environmental Monitoring | Version 1.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;