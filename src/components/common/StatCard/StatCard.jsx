import { getAirQualityStatus } from '../../../utils/deviceStatus';
import AirQualityBadge from '../AirQualityBadge/AirQualityBadge';
import './StatCard.css';

function StatCard({ data }) {
  const getComfortBadge = (sensorKey, rawValue) => {
    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return { text: 'Tidak Ada Data', tone: 'neutral' };
    }

    if (sensorKey === 'humidity') {
      if (value >= 30 && value <= 60) return { text: 'Aman', tone: 'good' };
      if (value >= 25 && value <= 70) return { text: 'Sedang', tone: 'moderate' };
      return { text: 'Perlu Cek', tone: 'alert' };
    }

    if (sensorKey === 'temperature') {
      if (value >= 18 && value <= 30) return { text: 'Aman', tone: 'good' };
      if (value >= 15 && value <= 35) return { text: 'Sedang', tone: 'moderate' };
      return { text: 'Perlu Cek', tone: 'alert' };
    }

    return { text: '—', tone: 'neutral' };
  };

  // Konfigurasi untuk setiap card
  const cardConfigs = [
    {
      title: 'Kelembapan Ruangan',
      key: 'humidity',
      unit: '%',
      label: 'DHT22',
      color: '#00b4d8',
      description: 'Mendeteksi kelembapan ruangan',
      decimals: 2
    },
    {
      title: 'Suhu Ruangan',
      key: 'temperature',
      unit: '°C',
      label: 'DHT22',
      color: '#ff6b6b',
      description: 'Mendeteksi suhu ruangan',
      decimals: 2
    },
    {
      title: 'Gas MQ135',
      key: 'mq135_ratio',
      unit: 'Ratio',
      label: 'MQ135',
      color: '#9b59b6',
      description: 'Mendeteksi kualitas udara dan gas berbahaya',
      decimals: 2
    },
    {
      title: 'Gas MQ7',
      key: 'mq7_ratio',
      unit: 'Ratio',
      label: 'MQ7',
      color: '#f39c12',
      description: 'Mendeteksi Karbon Monoksida',
      decimals: 2
    }
  ];

  // Ambil data terbaru (index 0) atau gunakan data dummy jika tidak ada
  const latestData = data && data.length > 0 ? data[0] : {
    humidity: 0,
    temperature: 0,
    mq135_ratio: 0,
    mq7_ratio: 0,
    mq135_ppm: 0,
    mq7_ppm: 0
  };

  // Hitung status kualitas udara berdasarkan MQ135 dan MQ7
  const airQualityStatus = getAirQualityStatus(
    latestData.mq135_ratio, 
    latestData.mq7_ratio
  );

  return (
    <div className="stats-container">
      {cardConfigs.map((config, index) => {
        const value = latestData[config.key] || 0;
        const displayValue = config.decimals > 0 
          ? Number(value).toFixed(config.decimals) 
          : value;

        // Tampilkan badge kualitas udara untuk MQ135 dan MQ7
        const showAirQualityBadge = config.key === 'mq135_ratio' || config.key === 'mq7_ratio';

        const comfortBadge = !showAirQualityBadge
          ? getComfortBadge(config.key, value)
          : null;

        return (
          <div key={index} className="stat-card" style={{ '--accent': config.color }}>
            <div className="stat-card-header">
              <div className="stat-card-meta">
                <span className="stat-card-sensor">{config.label}</span>
                <h3 className="stat-card-title">{config.title}</h3>
              </div>
              <div className="stat-card-badge-slot">
                {showAirQualityBadge ? (
                  <AirQualityBadge 
                    level={airQualityStatus.level}
                    text={airQualityStatus.text}
                    icon={airQualityStatus.icon}
                    color={airQualityStatus.color}
                  />
                ) : (
                  <span className={`stat-card-badge stat-card-badge--${comfortBadge.tone}`}>
                    {comfortBadge.text}
                  </span>
                )}
              </div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-value">
                <span className="value-number">
                  {displayValue}
                </span>
                <span className="value-unit">{config.unit}</span>
              </div>
              {config.description && (
                <>
                  <p className="stat-card-description">{config.description}</p>
                  {config.key === 'mq135_ratio' && (
                    <p className="stat-card-description">Estimasi PPM: {Number(latestData.mq135_ppm || 0).toFixed(2)}</p>
                  )}
                  {config.key === 'mq7_ratio' && (
                    <p className="stat-card-description">Estimasi PPM: {Number(latestData.mq7_ppm || 0).toFixed(2)}</p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCard;