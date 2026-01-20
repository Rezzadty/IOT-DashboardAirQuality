import React from 'react';
import DeviceStatus from '../../common/DeviceStatus/DeviceStatus';
import './Header.css';

const Header = ({ username, onLogout, deviceStatus }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">🌍</div>
            <div className="logo-text">
              <h1>Air Quality Monitor</h1>
              <span className="subtitle">Dashboard Monitoring Kualitas Udara</span>
            </div>
          </div>
          {deviceStatus && (
            <DeviceStatus 
              isOnline={deviceStatus.isOnline}
              lastUpdate={deviceStatus.lastUpdate}
              offlineMinutes={deviceStatus.offlineMinutes}
            />
          )}
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <span className="username">{username || 'User'}</span>
          </div>
          <button onClick={onLogout} className="logout-button">
            <span className="logout-icon">🚪</span>
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
