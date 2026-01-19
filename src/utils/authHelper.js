/**
 * Authentication Helper Functions
 * Fungsi-fungsi untuk mengelola autentikasi dan session
 */

// Cek apakah user sudah login
export const isAuthenticated = () => {
  const session = localStorage.getItem('userSession');
  if (!session) return false;

  try {
    const sessionData = JSON.parse(session);
    return sessionData.isAuthenticated === true;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return false;
  }
};

// Dapatkan data user dari session
export const getUserSession = () => {
  const session = localStorage.getItem('userSession');
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('userSession');
  window.location.href = '/';
};

// Protected Route Component (opsional)
export const requireAuth = (callback) => {
  if (!isAuthenticated()) {
    window.location.href = '/';
    return false;
  }
  return true;
};
