import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fungsi untuk mendapatkan pesan error yang ramah pengguna
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Format email tidak valid';
      case 'auth/user-disabled':
        return 'Akun ini telah dinonaktifkan';
      case 'auth/user-not-found':
        return 'Email atau password salah';
      case 'auth/wrong-password':
        return 'Email atau password salah';
      case 'auth/invalid-credential':
        return 'Email atau password salah';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan login. Coba lagi nanti';
      case 'auth/network-request-failed':
        return 'Koneksi internet bermasalah';
      default:
        return 'Terjadi kesalahan. Silakan coba lagi';
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi input tidak kosong
    if (!email.trim() || !password.trim()) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      // Login menggunakan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Login berhasil
      const user = userCredential.user;

      // Show success popup
      setShowSuccessPopup(true);

      // Simpan status login di localStorage
      const sessionData = {
        isAuthenticated: true,
        email: user.email,
        uid: user.uid,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));

      // Mulai transisi fade out setelah 1.2 detik
      setTimeout(() => {
        setIsTransitioning(true);
      }, 1200);

      // Redirect ke dashboard setelah transisi selesai (total 2 detik)
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      // Handle error
      console.error('Login error:', error);
      setError(getErrorMessage(error.code));
      setLoading(false);
    }
  };

  // Handle perubahan input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error saat user mengetik
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error saat user mengetik
  };

  return (
    <div className={`login-container ${isTransitioning ? 'fade-out' : ''}`}>
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
          <p>Sistem Monitoring Kualitas Udara IoT</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              autoComplete="email"
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Login Berhasil!</h3>
            <p>Mengalihkan ke dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
