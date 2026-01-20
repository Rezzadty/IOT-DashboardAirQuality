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

/**
 * Get air quality status berdasarkan nilai sensor
 * @param {number} mq135Ratio - Nilai MQ135
 * @param {number} mq7Ratio - Nilai MQ7
 * @returns {Object} Status kualitas udara
 */
export const getAirQualityStatus = (mq135Ratio, mq7Ratio) => {
  // Thresholds (sesuaikan dengan kebutuhan)
  const thresholds = {
    mq135: { good: 2, moderate: 5, unhealthy: 10 },
    mq7: { good: 5, moderate: 15, unhealthy: 30 }
  };

  let status = 'good'; // good, moderate, unhealthy, hazardous
  let level = 0;

  // Check MQ135 (Gas berbahaya)
  if (mq135Ratio >= thresholds.mq135.unhealthy) {
    status = 'hazardous';
    level = 3;
  } else if (mq135Ratio >= thresholds.mq135.moderate) {
    status = 'unhealthy';
    level = 2;
  } else if (mq135Ratio >= thresholds.mq135.good) {
    status = 'moderate';
    level = 1;
  }

  // Check MQ7 (Karbon Monoksida)
  if (mq7Ratio >= thresholds.mq7.unhealthy) {
    if (level < 3) {
      status = 'hazardous';
      level = 3;
    }
  } else if (mq7Ratio >= thresholds.mq7.moderate) {
    if (level < 2) {
      status = 'unhealthy';
      level = 2;
    }
  } else if (mq7Ratio >= thresholds.mq7.good) {
    if (level < 1) {
      status = 'moderate';
      level = 1;
    }
  }

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
