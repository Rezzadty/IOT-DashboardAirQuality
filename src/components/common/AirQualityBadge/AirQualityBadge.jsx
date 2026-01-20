import React from 'react';
import './AirQualityBadge.css';

const AirQualityBadge = ({ level, text, icon, color }) => {
  return (
    <div className={`air-quality-badge air-quality-${color}`}>
      <span className="air-quality-icon">{icon}</span>
      <span className="air-quality-text">Kualitas Udara: {text}</span>
    </div>
  );
};

export default AirQualityBadge;
