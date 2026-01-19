import React, { useEffect, useState } from 'react';
import { getUserSession, logout } from '../../utils/authHelper';
import { database, ref, onValue, query, orderByChild, limitToLast } from '../../services/firebase';
import Header from '../../components/layout/Header/Header';
import Table from '../../components/common/Table/Table';
import StatCard from '../../components/common/StatCard/StatCard';
import Footer from '../../components/layout/Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionData = getUserSession();
    if (sessionData) {
      setSession(sessionData);
    }

    // Fetch data terbaru dari Firebase (latest)
    const latestRef = ref(database, 'SensorData/latest');
    const unsubscribeLatest = onValue(latestRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Latest data received:', data);
        setLatestData({
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
        });
      }
    }, (error) => {
      console.error('Error fetching latest data:', error);
      setError(`Permission Error: Periksa Firebase Rules. Error: ${error.message}`);
    });

    // Fetch riwayat data dari Firebase (untuk tabel)
    // Ambil 100 data terakhir, diurutkan berdasarkan timestamp
    const historyRef = query(
      ref(database, 'SensorData/history'),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
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
        const sortedData = dataArray.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setSensorData(sortedData);
      } else {
        setSensorData([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching history data:', error);
      setError('Gagal mengambil riwayat data dari Firebase');
      setLoading(false);
    });

    // Cleanup subscriptions saat component unmount
    return () => {
      unsubscribeLatest();
      unsubscribeHistory();
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    // Add fade out class before closing
    const popup = document.querySelector('.logout-popup');
    const overlay = document.querySelector('.logout-popup-overlay');
    if (popup && overlay) {
      popup.classList.add('fade-out');
      overlay.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowLogoutPopup(false);
      logout();
    }, 300);
  };

  const handleLogoutCancel = () => {
    // Add fade out class before closing
    const popup = document.querySelector('.logout-popup');
    const overlay = document.querySelector('.logout-popup-overlay');
    if (popup && overlay) {
      popup.classList.add('fade-out');
      overlay.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowLogoutPopup(false);
    }, 300);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <Header username={session?.username} onLogout={handleLogoutClick} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          color: '#fff',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>⏳</div>
            <div>Memuat data dari Firebase...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <Header username={session?.username} onLogout={handleLogoutClick} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          color: '#ff6b6b',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>⚠️</div>
            <div>{error}</div>
            <div style={{ fontSize: '14px', marginTop: '10px', color: '#aaa' }}>
              Pastikan konfigurasi Firebase sudah benar
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header username={session?.username} onLogout={handleLogoutClick} />

      {/* Statistics Cards - menggunakan data terbaru */}
      <StatCard data={latestData ? [latestData] : []} />

      {/* Tabel Data Sensor - menggunakan riwayat data */}
      <Table data={sensorData} />

      {/* Footer */}
      <Footer />

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin keluar dari sistem?</p>
            <div className="logout-popup-buttons">
              <button onClick={handleLogoutCancel} className="cancel-btn">
                Batal
              </button>
              <button onClick={handleLogoutConfirm} className="confirm-btn">
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
