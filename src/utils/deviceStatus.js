/**
 * Utility functions untuk mengecek status alat (online/offline)
 * Berdasarkan timestamp terakhir data terupdate
 */

/**
 * Mengecek apakah alat masih online berdasarkan timestamp terakhir
 * @param {string|Date} lastUpdateTimestamp - Timestamp terakhir data terupdate
 * @param {number} thresholdMinutes - Batas waktu dalam menit (default: 1 menit)
 * @returns {Object} Status alat dan informasi terkait
 */
export const checkDeviceStatus = (lastUpdateTimestamp, thresholdMinutes = 1) => {
  if (!lastUpdateTimestamp) {
    return {
      isOnline: false,
      lastUpdate: null,
      offlineMinutes: null,
      statusText: 'Tidak Ada Data'
    };
  }

  const now = Date.now();
  const lastUpdate = new Date(lastUpdateTimestamp).getTime();
  const diffMilliseconds = now - lastUpdate;
  const diffMinutes = diffMilliseconds / (1000 * 60);

  const isOnline = diffMinutes < thresholdMinutes;

  return {
    isOnline,
    lastUpdate: lastUpdateTimestamp,
    offlineMinutes: Math.floor(diffMinutes),
    offlineSeconds: Math.floor(diffMilliseconds / 1000),
    statusText: isOnline ? 'Alat Aktif' : 'Alat Mati',
    lastUpdateFormatted: formatTimestamp(lastUpdateTimestamp)
  };
};

/**
 * Format timestamp ke format yang lebih readable
 * @param {string|Date} timestamp 
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';

  const date = new Date(timestamp);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) {
    return `${diffSeconds} detik yang lalu`;
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else {
    // Format: DD/MM/YYYY HH:MM
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};

const normalizeRatio = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
};

// Kurva power-law (aproksimasi datasheet umum) untuk estimasi PPM dari rasio Rs/R0.
// Nilai ini bukan kalibrasi laboratorium dan bisa disesuaikan per modul/sensor.
const MQ135_CURVE = { a: 116.6020682, b: -2.769034857 };
const MQ7_CURVE = { a: 99.042, b: -1.518 };

const ratioToPpm = (ratio, curve) => {
  const safeRatio = normalizeRatio(ratio);
  if (safeRatio <= 0) return 0;
  return curve.a * Math.pow(safeRatio, curve.b);
};

export const calculateMq135Ppm = (mq135Ratio) => {
  return Number(ratioToPpm(mq135Ratio, MQ135_CURVE).toFixed(2));
};

export const calculateMq7Ppm = (mq7Ratio) => {
  return Number(ratioToPpm(mq7Ratio, MQ7_CURVE).toFixed(2));
};

/**
 * Get air quality status berdasarkan nilai sensor
 * @param {number} mq135Ratio - Nilai MQ135
 * @param {number} mq7Ratio - Nilai MQ7
 * @returns {Object} Status kualitas udara
 */
export const getAirQualityStatus = (mq135Ratio, mq7Ratio) => {
  // Samakan arah logika dengan ESP: rasio lebih besar = udara lebih bersih.
  const thresholds = {
    mq135: { clean: 1.6, moderate: 1.1, poor: 0.7 },
    mq7: { clean: 1.5, moderate: 1.0, poor: 0.6 }
  };

  const getLevelFromRatio = (ratio, sensorThreshold) => {
    const value = normalizeRatio(ratio);
    if (value > sensorThreshold.clean) return 0;
    if (value > sensorThreshold.moderate) return 1;
    if (value > sensorThreshold.poor) return 2;
    return 3;
  };

  const mq135Level = getLevelFromRatio(mq135Ratio, thresholds.mq135);
  const mq7Level = getLevelFromRatio(mq7Ratio, thresholds.mq7);
  const level = Math.max(mq135Level, mq7Level);

  const levelToStatus = {
    0: 'good',
    1: 'moderate',
    2: 'unhealthy',
    3: 'hazardous'
  };

  const status = levelToStatus[level] || 'good';

  const statusLabels = {
    good: { text: 'Baik', icon: '🟢', color: 'green' },
    moderate: { text: 'Sedang', icon: '🟡', color: 'yellow' },
    unhealthy: { text: 'Tidak Sehat', icon: '🟠', color: 'orange' },
    hazardous: { text: 'Berbahaya', icon: '🔴', color: 'red' }
  };

  return {
    status,
    level,
    ...statusLabels[status]
  };
};
