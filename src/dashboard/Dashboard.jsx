import React, { useEffect, useState } from 'react';
import { getUserSession, logout } from '../auth/authHelper';
import './Dashboard.css';

const Dashboard = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionData = getUserSession();
    if (sessionData) {
      setSession(sessionData);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Monitoring Kualitas Udara</h1>
        <div className="user-info">
          <span>👤 {session?.username || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn">
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
    </div>
  );
};

export default Dashboard;
