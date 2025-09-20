import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Tracking from './pages/Tracking'
import Dashboard from './pages/Dashboard'
import DriverManifest from './pages/DriverManifest'
import { getClientId } from './lib/api'
import Status from './components/Status'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const clientId = getClientId()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">ST</div>
            <div>
              <h1>SwiftTrack</h1>
              <div className="subtitle">Professional Logistics Platform</div>
            </div>
          </div>
          
          <nav>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link 
              to="/orders" 
              className={isActive('/orders') ? 'active' : ''}
            >
              Orders
            </Link>
            <Link 
              to="/tracking" 
              className={isActive('/tracking') ? 'active' : ''}
            >
              Tracking
            </Link>
            <Link 
              to="/driver" 
              className={isActive('/driver') ? 'active' : ''}
            >
              Driver
            </Link>
          </nav>
          
          <div className="auth">
            <BackendStatus />
            {clientId ? (
              <div className="user-info">
                <div className="user-avatar">{clientId.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="text-sm font-medium">{clientId}</div>
                  <button 
                    className="btn-secondary text-xs" 
                    onClick={() => { localStorage.removeItem('clientId'); navigate('/login') }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div>© {new Date().getFullYear()} SwiftTrack Logistics Platform</div>
        <div className="text-xs text-gray-500 mt-2">
          Connecting businesses with reliable delivery solutions
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const authed = !!getClientId()
  return (
    <Routes>
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/orders" element={authed ? <Layout><Orders /></Layout> : <Navigate to="/login" />} />
      <Route path="/tracking" element={authed ? <Layout><Tracking /></Layout> : <Navigate to="/login" />} />
      <Route path="/driver" element={authed ? <Layout><DriverManifest /></Layout> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Layout><div>Not found</div></Layout>} />
    </Routes>
  )
}
