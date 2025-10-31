import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Secret key untuk enkripsi (idealnya dari environment variable)
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'iot-dashboard-secret-key-2025';

  // Kredensial terenkripsi
  const encryptedCredentials = {
    username: CryptoJS.AES.encrypt('admin', SECRET_KEY).toString(),
    password: CryptoJS.AES.encrypt('password123', SECRET_KEY).toString()
  };

  // Fungsi untuk dekripsi data
  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Dekripsi gagal:', error);
      return null;
    }
  };

  // Validasi kredensial
  const validateCredentials = (inputUsername, inputPassword) => {
    const decryptedUsername = decryptData(encryptedCredentials.username);
    const decryptedPassword = decryptData(encryptedCredentials.password);

    return inputUsername === decryptedUsername && inputPassword === decryptedPassword;
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validasi input tidak kosong
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);

    // Simulasi delay untuk loading (opsional)
    setTimeout(() => {
      // Validasi kredensial
      if (validateCredentials(username, password)) {
        // Simpan status login di localStorage
        const sessionData = {
          isAuthenticated: true,
          username: username,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        // Redirect ke dashboard atau halaman utama
        window.location.href = '/dashboard';
      } else {
        setError('Username atau password salah');
        setLoading(false);
      }
    }, 500);
  };

  // Handle perubahan input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(''); // Clear error saat user mengetik
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error saat user mengetik
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
          <p>Sistem Monitoring Kualitas Udara IoT</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={username}
              onChange={handleUsernameChange}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
