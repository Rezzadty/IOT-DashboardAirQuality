import React from 'react';
import './ErrorState.css';

const ErrorState = ({ 
  error, 
  message = 'Pastikan konfigurasi Firebase sudah benar' 
}) => {
  return (
    <div className="error-state">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
        <div className="error-hint">{message}</div>
      </div>
    </div>
  );
};

export default ErrorState;
