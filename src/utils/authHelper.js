import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

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

// Logout user dengan Firebase Authentication
export const logout = async () => {
  try {
    localStorage.removeItem('userSession');
    await signOut(auth);
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('userSession');
    window.location.href = '/';
  }
};

// Protected Route Component (opsional)
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/';
    return false;
  }
  return true;
};
