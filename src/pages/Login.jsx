import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setClientId } from '../lib/api'

export default function Login() {
  const [clientId, setClient] = useState('CLIENT001')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    if (!clientId.trim()) return
    
    setLoading(true)
    // Simulate login process
    setTimeout(() => {
      setClientId(clientId.trim())
      setLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  const quickLogin = (id) => {
    setClient(id)
    setClientId(id)
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <section className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="logo-icon mx-auto mb-4" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
              ST
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Welcome to SwiftTrack</h2>
            <p className="text-muted">Your Professional Logistics Management Platform</p>
          </div>

          <div className="card">
            <div className="card-header text-center">
              <h3 className="card-title">Access Your Dashboard</h3>
            </div>
            <div className="card-content">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label required" htmlFor="clientId">Client ID</label>
                  <input 
                    id="clientId"
                    className="form-control"
                    value={clientId} 
                    onChange={e=>setClient(e.target.value)} 
                    placeholder="Enter your Client ID (e.g., CLIENT001)"
                    required
                  />
                  <div className="form-help">
                    Your unique client identifier for accessing the platform
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full ${loading ? 'opacity-75' : ''}`}
                  disabled={loading || !clientId.trim()}
                >
                  {loading ? (
                    <>
                      <span className="loading"></span>
                      Logging in...
                    </>
                  ) : (
                    '🚀 Access Dashboard'
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="text-center text-sm text-muted mb-4">Quick Demo Access</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => quickLogin('CLIENT001')}
                    className="btn btn-secondary btn-sm"
                  >
                    Demo Client A
                  </button>
                  <button 
                    onClick={() => quickLogin('CLIENT002')}
                    className="btn btn-secondary btn-sm"
                  >
                    Demo Client B
                  </button>
                  <button 
                    onClick={() => quickLogin('ENTERPRISE')}
                    className="btn btn-secondary btn-sm"
                  >
                    Enterprise
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-6">
            <div>
              <strong>🔒 Demo Mode</strong>
              <div className="text-sm mt-2">
                This is a demonstration environment. No password required - simply enter any Client ID to continue.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-primary mb-2">Platform Features</h3>
          <p className="text-muted">Everything you need for modern logistics management</p>
        </div>
        
        <div className="grid gap-4">
          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-primary mb-2">Real-time Dashboard</h4>
              <p className="text-sm text-muted">
                Monitor your operations with live analytics, system health, and performance metrics.
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="font-semibold text-primary mb-2">Order Management</h4>
              <p className="text-sm text-muted">
                Submit orders, track processing, and manage deliveries with our integrated workflow system.
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">🚛</div>
              <h4 className="font-semibold text-primary mb-2">Fleet Tracking</h4>
              <p className="text-sm text-muted">
                Monitor vehicle status, route optimization, and delivery progress in real-time.
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-primary mb-2">Route Optimization</h4>
              <p className="text-sm text-muted">
                AI-powered route planning integrating with our advanced ROS system for maximum efficiency.
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-primary mb-2">Driver Portal</h4>
              <p className="text-sm text-muted">
                Complete delivery management with manifests, status updates, and customer communication.
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-primary mb-2">System Integration</h4>
              <p className="text-sm text-muted">
                Seamlessly connects CMS, ROS, and WMS systems for comprehensive logistics operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
