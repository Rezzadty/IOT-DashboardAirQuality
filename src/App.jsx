import { useState, useEffect } from 'react'
import Login from './pages/auth/login/login.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import { isAuthenticated } from './utils/authHelper'
import './styles/App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  useEffect(() => {
    // Cek autentikasi saat aplikasi dimuat
    const path = window.location.pathname
    
    if (path === '/dashboard') {
      if (isAuthenticated()) {
        setCurrentPage('dashboard')
      } else {
        window.location.href = '/'
      }
    } else {
      if (isAuthenticated()) {
        setCurrentPage('dashboard')
      } else {
        setCurrentPage('login')
      }
    }
  }, [])

  // Simple routing tanpa library eksternal
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'login':
      default:
        return <Login />
    }
  }

  return (
    <>
      {renderPage()}
    </>
  )
}

export default App
