import React, { useEffect, useState } from 'react';
import { getUserSession, logout } from '../../utils/authHelper';
import { useToast } from '../../utils/useToast';
import { useSensorData } from '../../utils/useSensorData';
import Header from '../../components/layout/Header/Header';
import Table from '../../components/common/Table/Table';
import StatCard from '../../components/common/StatCard/StatCard';
import SensorChart from '../../components/common/SensorChart/SensorChart';
import Footer from '../../components/layout/Footer/Footer';
import Toast from '../../components/common/Toast/Toast';
import LoadingState from '../../components/common/LoadingState/LoadingState';
import ErrorState from '../../components/common/ErrorState/ErrorState';
import './Dashboard.css';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  
  const { toasts, showSuccess, showError, showWarning, hideToast } = useToast();
  
  // Fetch sensor data menggunakan custom hook
  const { latestData, sensorData, deviceStatus, loading, error } = useSensorData({
    showSuccess,
    showError,
    showWarning
  });

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

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <Header username={session?.username} onLogout={handleLogoutClick} />
        <LoadingState />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <Header username={session?.username} onLogout={handleLogoutClick} />
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header 
        username={session?.username} 
        onLogout={handleLogoutClick}
        deviceStatus={deviceStatus}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          persistent={toast.persistent}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      {/* Statistics Cards - menggunakan data terbaru */}
      <StatCard data={latestData ? [latestData] : []} />

      {/* Grafik Tren Data Sensor */}
      <SensorChart data={sensorData} />

      {/* Tabel Data Sensor - menggunakan riwayat data */}
      <Table data={sensorData} />

      {/* Footer */}
      <Footer />

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
