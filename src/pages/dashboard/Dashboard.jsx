import React, { useEffect, useState } from 'react';
import { getUserSession, logout } from '../auth/authHelper';
import Table from '../../components/table/Table';
import './Dashboard.css';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [sensorData, setSensorData] = useState([
    // Data dummy untuk contoh tabel
    {
      id: 1,
      humidity: 77.73,
      temperature: 29.37,
      mq135_ratio: 216,
      mq7_ratio: 12.66,
      voltage_rms: 207.83,
      timestamp: '2025-12-08 17:32:05'
    },
    {
      id: 2,
      humidity: 75.20,
      temperature: 28.50,
      mq135_ratio: 210,
      mq7_ratio: 11.50,
      voltage_rms: 205.40,
      timestamp: '2025-12-08 17:02:05'
    },
    {
      id: 3,
      humidity: 76.80,
      temperature: 29.00,
      mq135_ratio: 215,
      mq7_ratio: 12.00,
      voltage_rms: 206.50,
      timestamp: '2025-12-08 16:32:05'
    }
  ]);

  useEffect(() => {
    const sessionData = getUserSession();
    if (sessionData) {
      setSession(sessionData);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    // Add fade out class before closing
    const popup = document.querySelector('.logout-popup');
    const overlay = document.querySelector('.logout-popup-overlay');
    if (popup && overlay) {
      popup.classList.add('fade-out');
      overlay.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowLogoutPopup(false);
      logout();
    }, 300);
  };

  const handleLogoutCancel = () => {
    // Add fade out class before closing
    const popup = document.querySelector('.logout-popup');
    const overlay = document.querySelector('.logout-popup-overlay');
    if (popup && overlay) {
      popup.classList.add('fade-out');
      overlay.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowLogoutPopup(false);
    }, 300);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Monitoring Kualitas Udara</h1>
        <div className="user-info">
          <span>👤 {session?.username || 'User'}</span>
          <button onClick={handleLogoutClick} className="logout-btn">
            Keluar
          </button>
        </div>
      </div>

      <div> 
        <div className="DHT-22">
          <h1>Kelembapan Ruangan</h1>
          <span></span>
          <h1>Suhu Ruangan</h1>
        </div>
      </div>

      {/* Tabel Data Sensor */}
      <Table data={sensorData} />

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin keluar dari sistem?</p>
            <div className="logout-popup-buttons">
              <button onClick={handleLogoutCancel} className="cancel-btn">
                Batal
              </button>
              <button onClick={handleLogoutConfirm} className="confirm-btn">
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
