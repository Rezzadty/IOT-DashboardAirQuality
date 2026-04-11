import { useState, useEffect, useRef } from 'react';
import { database, ref, onValue, query, orderByChild, limitToLast } from '../services/firebase';
import {
  checkDeviceStatus,
  getAirQualityStatus,
  calculateMq135Ppm,
  calculateMq7Ppm,
} from './deviceStatus';

const ignoreExpectedPermissionError = (err) => {
  const code = String(err?.code || '').toLowerCase();
  const message = String(err?.message || '').toLowerCase();

  return (
    code.includes('permission-denied') ||
    message.includes('permission denied') ||
    message.includes('permission_denied') ||
    message.includes('unauthorized')
  );
};

/**
 * Custom hook untuk fetch dan manage sensor data dari Firebase
 * @param {Object} options - Options untuk toast notifications
 * @returns {Object} { latestData, sensorData, deviceStatus, loading, error }
 */
export const useSensorData = ({ showToast, showSuccess, showError, hideToast } = {}) => {
  const [latestData, setLatestData] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({ isOnline: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const previousStatusRef = useRef(null);
  const previousAirQualityStatusRef = useRef(null);
  const activeAirQualityToastIdRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const latestRef = ref(database, 'SensorData/latest');
    const unsubscribeLatest = onValue(
      latestRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setLoading(false);
          return;
        }

        const data = snapshot.val();
        const mq135Ratio = Number(data.mq135_ratio) || 0;
        const mq7Ratio = Number(data.mq7_ratio) || 0;

        const newLatestData = {
          humidity: Number(data.humidity) || 0,
          temperature: Number(data.temperature) || 0,
          mq135_ratio: mq135Ratio,
          mq7_ratio: mq7Ratio,
          mq135_ppm: Number(data.mq135_ppm) || calculateMq135Ppm(mq135Ratio),
          mq7_ppm: Number(data.mq7_ppm) || calculateMq7Ppm(mq7Ratio),
          timestamp: data.timestamp || new Date().toISOString(),
          device_status: data.device_status || 'offline',
          mq135_status: data.mq135_status || 'Unknown',
          mq7_status: data.mq7_status || 'Unknown',
          mq135_voltage: Number(data.mq135_voltage) || 0,
          mq7_voltage: Number(data.mq7_voltage) || 0,
        };

        setLatestData(newLatestData);

        const status = checkDeviceStatus(newLatestData.timestamp, 1);
        setDeviceStatus(status);

        if (!isFirstRenderRef.current && previousStatusRef.current !== null) {
          if (previousStatusRef.current.isOnline && !status.isOnline) {
            if (activeAirQualityToastIdRef.current !== null && typeof hideToast === 'function') {
              hideToast(activeAirQualityToastIdRef.current);
              activeAirQualityToastIdRef.current = null;
            }

            if (showError) {
              showError(
                `Alat tidak merespons! Terakhir update ${status.offlineMinutes} menit yang lalu.`,
                true
              );
            }
          } else if (!previousStatusRef.current.isOnline && status.isOnline) {
            if (showSuccess) {
              showSuccess('Alat kembali aktif! Data berhasil diperbarui.');
            }
          } else if (status.isOnline) {
            const airQuality = getAirQualityStatus(newLatestData.mq135_ratio, newLatestData.mq7_ratio);

            if (previousAirQualityStatusRef.current !== airQuality.status) {
              if (activeAirQualityToastIdRef.current !== null && typeof hideToast === 'function') {
                hideToast(activeAirQualityToastIdRef.current);
                activeAirQualityToastIdRef.current = null;
              }

              const qualityMessage = `Kualitas udara ${airQuality.text}. ${airQuality.icon}`;

              if (airQuality.level === 0 && showToast) {
                activeAirQualityToastIdRef.current = showToast(qualityMessage, 'success', 5000, false);
              } else if (airQuality.level === 1 && showToast) {
                activeAirQualityToastIdRef.current = showToast(qualityMessage, 'warning', 7000, false);
              } else if (airQuality.level === 2 && showToast) {
                activeAirQualityToastIdRef.current = showToast(qualityMessage, 'warning', 0, true);
              } else if (airQuality.level === 3 && showToast) {
                activeAirQualityToastIdRef.current = showToast(qualityMessage, 'error', 0, true);
              }

              previousAirQualityStatusRef.current = airQuality.status;
            }
          }
        }

        previousStatusRef.current = status;
        if (isFirstRenderRef.current) {
          isFirstRenderRef.current = false;
        }

        setLoading(false);
      },
      (err) => {
        if (ignoreExpectedPermissionError(err)) {
          setLoading(false);
          return;
        }

        console.error('Error fetching latest data:', err);
        setError(`Permission Error: Periksa Firebase Rules. Error: ${err.message}`);
        if (showError) {
          showError('Gagal mengambil data dari Firebase!');
        }
        setLoading(false);
      }
    );

    const historyRef = query(ref(database, 'SensorData/history'), orderByChild('timestamp'), limitToLast(100));

    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.keys(data).map((key, index) => {
            const mq135Ratio = Number(data[key].mq135_ratio) || 0;
            const mq7Ratio = Number(data[key].mq7_ratio) || 0;

            return {
              id: index + 1,
              humidity: Number(data[key].humidity) || 0,
              temperature: Number(data[key].temperature) || 0,
              mq135_ratio: mq135Ratio,
              mq7_ratio: mq7Ratio,
              mq135_ppm: Number(data[key].mq135_ppm) || calculateMq135Ppm(mq135Ratio),
              mq7_ppm: Number(data[key].mq7_ppm) || calculateMq7Ppm(mq7Ratio),
              timestamp: data[key].timestamp || '',
              device_status: data[key].device_status || 'offline',
              mq135_status: data[key].mq135_status || 'Unknown',
              mq7_status: data[key].mq7_status || 'Unknown',
            };
          });

          const sortedData = dataArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setSensorData(sortedData);
        } else {
          setSensorData([]);
        }

        setLoading(false);
      },
      (err) => {
        if (ignoreExpectedPermissionError(err)) {
          setLoading(false);
          return;
        }

        console.error('Error fetching history data:', err);
        setError('Gagal mengambil riwayat data dari Firebase');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeLatest();
      unsubscribeHistory();
    };
  }, [showToast, showSuccess, showError, hideToast]);

  return {
    latestData,
    sensorData,
    deviceStatus,
    loading,
    error,
  };
};

export default useSensorData;
