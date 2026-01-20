import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message = 'Memuat data dari Firebase...' }) => {
  return (
    <div className="loading-state">
      <div className="loading-content">
        <div className="loading-icon">⏳</div>
        <div className="loading-message">{message}</div>
      </div>
    </div>
  );
};

export default LoadingState;
