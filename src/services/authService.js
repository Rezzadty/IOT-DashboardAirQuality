import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/**
 * Cek apakah user sudah login
 * @returns {Promise<Object|null>} User object jika login, null jika tidak
 */
export const checkUserAuthentication = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('userSession');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Dapatkan user yang sedang login
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Cek apakah ada session yang valid
 * @returns {boolean}
 */
export const isSessionValid = () => {
  const sessionData = localStorage.getItem('userSession');
  if (!sessionData) return false;

  try {
    const session = JSON.parse(sessionData);
    return session.isAuthenticated === true;
  } catch {
    return false;
  }
};
