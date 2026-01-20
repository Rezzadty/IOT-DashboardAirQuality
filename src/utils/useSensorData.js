import { useState, useEffect, useRef } from 'react';
import { database, ref, onValue, query, orderByChild, limitToLast } from '../services/firebase';
import { checkDeviceStatus, getAirQualityStatus } from './deviceStatus';

/**
 * Custom hook untuk fetch dan manage sensor data dari Firebase
 * @param {Object} options - Options untuk toast notifications
 * @returns {Object} { latestData, sensorData, deviceStatus, loading, error }
 */
export const useSensorData = ({ showSuccess, showError, showWarning } = {}) => {
  const [latestData, setLatestData] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({ isOnline: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const previousStatusRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    // Fetch data terbaru dari Firebase (latest)
    const latestRef = ref(database, 'SensorData/latest');
    const unsubscribeLatest = onValue(
      latestRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Latest data received:', data);

          const newLatestData = {
            humidity: data.humidity || 0,
            temperature: data.temperature || 0,
            mq135_ratio: data.mq135_ratio || 0,
            mq7_ratio: data.mq7_ratio || 0,
            voltage_rms: data.voltage_rms || 0,
            timestamp: data.timestamp || new Date().toISOString(),
            device_status: data.device_status || 'offline',
            mq135_status: data.mq135_status || 'Unknown',
            mq7_status: data.mq7_status || 'Unknown',
            mq135_voltage: data.mq135_voltage || 0,
            mq7_voltage: data.mq7_voltage || 0
          };

          setLatestData(newLatestData);

          // Check device status berdasarkan timestamp
          const status = checkDeviceStatus(newLatestData.timestamp, 1);
          setDeviceStatus(status);

          // Tampilkan notifikasi berdasarkan perubahan status
          if (!isFirstRenderRef.current && previousStatusRef.current !== null) {
            // Jika status berubah dari online ke offline
            if (previousStatusRef.current.isOnline && !status.isOnline) {
              if (showError) {
                showError(
                  `Alat tidak merespons! Terakhir update ${status.offlineMinutes} menit yang lalu.`,
                  true
                );
              }
            }
            // Jika status berubah dari offline ke online
            else if (!previousStatusRef.current.isOnline && status.isOnline) {
              if (showSuccess) {
                showSuccess('Alat kembali aktif! Data berhasil diperbarui.');
              }
            }
            // Jika online dan ada update data
            else if (status.isOnline) {
              // Check air quality status
              const airQuality = getAirQualityStatus(
                newLatestData.mq135_ratio,
                newLatestData.mq7_ratio
              );

              if (airQuality.level >= 3 && showError) {
                showError(`Kualitas udara ${airQuality.text}! ${airQuality.icon}`, true);
              } else if (airQuality.level === 2 && showWarning) {
                showWarning(`Kualitas udara ${airQuality.text}. ${airQuality.icon}`);
              }
            }
          }

          previousStatusRef.current = status;
          if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
          }
        }
      },
      (err) => {
        console.error('Error fetching latest data:', err);
        setError(`Permission Error: Periksa Firebase Rules. Error: ${err.message}`);
        if (showError) {
          showError('Gagal mengambil data dari Firebase!');
        }
      }
    );

    // Fetch riwayat data dari Firebase (untuk tabel)
    // Ambil 100 data terakhir, diurutkan berdasarkan timestamp
    const historyRef = query(
      ref(database, 'SensorData/history'),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.keys(data).map((key, index) => ({
            id: index + 1,
            humidity: data[key].humidity || 0,
            temperature: data[key].temperature || 0,
            mq135_ratio: data[key].mq135_ratio || 0,
            mq7_ratio: data[key].mq7_ratio || 0,
            voltage_rms: data[key].voltage_rms || 0,
            timestamp: data[key].timestamp || '',
            device_status: data[key].device_status || 'offline',
            mq135_status: data[key].mq135_status || 'Unknown',
            mq7_status: data[key].mq7_status || 'Unknown'
          }));

          // Urutkan dari yang terbaru ke terlama
          const sortedData = dataArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          setSensorData(sortedData);
        } else {
          setSensorData([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching history data:', err);
        setError('Gagal mengambil riwayat data dari Firebase');
        setLoading(false);
      }
    );

    // Cleanup subscriptions saat component unmount
    return () => {
      unsubscribeLatest();
      unsubscribeHistory();
    };
  }, [showSuccess, showError, showWarning]);

  return {
    latestData,
    sensorData,
    deviceStatus,
    loading,
    error
  };
};

export default useSensorData;
