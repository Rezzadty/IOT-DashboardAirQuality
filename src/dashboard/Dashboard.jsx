import React, { useEffect, useState } from 'react';
import { getUserSession, logout } from '../auth/authHelper';
import './Dashboard.css';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

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

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Selamat Datang, {session?.username}! 🎉</h2>
          <p>Anda berhasil login ke sistem monitoring kualitas udara IoT.</p>
          <div className="session-info">
            <p><strong>Waktu Login:</strong> {session?.loginTime ? new Date(session.loginTime).toLocaleString('id-ID') : '-'}</p>
          </div>
        </div>
      </div>

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
