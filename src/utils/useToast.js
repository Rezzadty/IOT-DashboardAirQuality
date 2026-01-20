import { useState, useCallback } from 'react';

/**
 * Custom hook untuk manage toast notifications
 * @returns {Object} { toasts, showToast, hideToast, clearAllToasts }
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Menampilkan toast notification
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {string} type - Tipe toast: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Durasi dalam milliseconds (0 = persistent)
   * @param {boolean} persistent - Apakah toast persistent (harus di-close manual)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000, persistent = false) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration: persistent ? 0 : duration,
      persistent
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove jika tidak persistent
    if (!persistent && duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration + 300); // +300ms untuk animasi exit
    }

    return id;
  }, []);

  /**
   * Menyembunyikan toast berdasarkan ID
   * @param {number} id - ID toast yang akan disembunyikan
   */
  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Menghapus semua toast
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Helper functions untuk tipe toast yang sering digunakan
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, persistent = true) => {
    return showToast(message, 'error', persistent ? 0 : 5000, persistent);
  }, [showToast]);

  const showWarning = useCallback((message, duration = 5000) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;
