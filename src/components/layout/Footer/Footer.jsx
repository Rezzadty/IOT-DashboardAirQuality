import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <h3>Dashboard Monitoring Kualitas Udara</h3>
            <p>Sistem monitoring real-time untuk pemantauan kualitas udara berbasis IoT. Membantu dalam pengawasan dan analisis kondisi lingkungan secara akurat dan efisien.</p>
          </div>
          
          <div className="footer-section">
            <h4>Fitur Sistem</h4>
            <ul>
              <li>Monitoring Real-time</li>
              <li>Analisis Data Sensor</li>
              <li>Export Data (PDF)</li>
              <li>Riwayat Data Lengkap</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Sensor Terintegrasi</h4>
            <ul>
              <li>DHT22 - Kelembapan & Suhu</li>
              <li>MQ135 - Kualitas Udara</li>
              <li>MQ7 - Karbon Monoksida</li>
              <li>ZMPT101B - Tegangan RMS</li>
            </ul>
          </div>
        </div>
        
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