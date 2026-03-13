import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import Login from './pages/auth/login/login.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import { auth } from './services/firebase'
import './styles/App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('loading')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const path = window.location.pathname

      if (user) {
        // User is signed in
        const sessionData = {
          isAuthenticated: true,
          email: user.email,
          uid: user.uid,
          loginTime: new Date().toISOString()
        }
        localStorage.setItem('userSession', JSON.stringify(sessionData))

        setCurrentPage('dashboard')
      } else {
        // User is signed out
        localStorage.removeItem('userSession')

        if (path === '/dashboard') {
          window.location.href = '/'
        } else {
          setCurrentPage('login')
        }
      }

      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Simple routing tanpa library eksternal
  const renderPage = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading...</p>
          </div>
        </div>
      )
    }

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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {renderPage()}
    </>
  )
}

export default App
