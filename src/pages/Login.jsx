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
    <div>
      <section>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="logo-icon mx-auto mb-4" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
              ST
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SwiftTrack</h2>
            <p className="text-gray-600">Your Professional Logistics Management Platform</p>
          </div>

          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <label htmlFor="clientId">Client ID</label>
              <input 
                id="clientId"
                value={clientId} 
                onChange={e=>setClient(e.target.value)} 
                placeholder="Enter your Client ID (e.g., CLIENT001)"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
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
                  <span className="loading mr-2"></span>
                  Logging in...
                </>
              ) : (
                '🚀 Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-4">Quick Demo Access</div>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => quickLogin('CLIENT001')}
                className="btn btn-secondary text-xs"
              >
                Demo Client A
              </button>
              <button 
                onClick={() => quickLogin('CLIENT002')}
                className="btn btn-secondary text-xs"
              >
                Demo Client B
              </button>
              <button 
                onClick={() => quickLogin('ENTERPRISE')}
                className="btn btn-secondary text-xs"
              >
                Enterprise
              </button>
            </div>
          </div>

          <div className="alert alert-info mt-6">
            <div>
              <strong>🔒 Demo Mode</strong>
              <div className="text-sm mt-1">
                This is a demonstration environment. No password required - simply enter any Client ID to continue.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Features</h3>
          <p className="text-gray-600">Everything you need for modern logistics management</p>
        </div>
        
        <div className="grid gap-6">
          <div className="card text-center">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Dashboard</h4>
            <p className="text-sm text-gray-600">
              Monitor your operations with live analytics, system health, and performance metrics.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">📦</div>
            <h4 className="font-semibold text-gray-900 mb-2">Order Management</h4>
            <p className="text-sm text-gray-600">
              Submit orders, track processing, and manage deliveries with our integrated workflow system.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">🚛</div>
            <h4 className="font-semibold text-gray-900 mb-2">Fleet Tracking</h4>
            <p className="text-sm text-gray-600">
              Monitor vehicle status, route optimization, and delivery progress in real-time.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Route Optimization</h4>
            <p className="text-sm text-gray-600">
              AI-powered route planning integrating with our advanced ROS system for maximum efficiency.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-semibold text-gray-900 mb-2">Driver Portal</h4>
            <p className="text-sm text-gray-600">
              Complete delivery management with manifests, status updates, and customer communication.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-2">System Integration</h4>
            <p className="text-sm text-gray-600">
              Seamlessly connects CMS, ROS, and WMS systems for comprehensive logistics operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
