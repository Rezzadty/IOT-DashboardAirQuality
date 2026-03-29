import './AirQualityBadge.css';

const AirQualityBadge = ({ text, icon, color }) => {
  return (
    <div className={`air-quality-badge air-quality-${color}`}>
      <span className="air-quality-icon">{icon}</span>
      <span className="air-quality-text">{text}</span>
    </div>
  );
};

export default AirQualityBadge;
