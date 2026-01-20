import React from 'react';
import './DeviceStatus.css';

const DeviceStatus = ({ isOnline, lastUpdate, offlineMinutes }) => {
  return (
    <div className={`device-status ${isOnline ? 'online' : 'offline'}`}>
      <span className="status-icon">
        {isOnline ? '🟢' : '🔴'}
      </span>
      <div className="status-text">
        <span className="status-label">
          {isOnline ? 'Alat Aktif' : 'Alat Mati'}
        </span>
        {!isOnline && offlineMinutes !== null && (
          <span className="status-detail">
            {offlineMinutes < 60 
              ? `${offlineMinutes} menit yang lalu`
              : `${Math.floor(offlineMinutes / 60)} jam yang lalu`
            }
          </span>
        )}
      </div>
    </div>
  );
};

export default DeviceStatus;
