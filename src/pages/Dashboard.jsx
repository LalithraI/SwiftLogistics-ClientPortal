import React, { useEffect, useState } from 'react'
import { getDashboard, getVehicles } from '../lib/api'

export default function Dashboard() {
  const [dash, setDash] = useState(null)
  const [vehicles, setVehicles] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setError('')
    setLoading(true)
    try {
      const [d, v] = await Promise.all([getDashboard(), getVehicles()])
      setDash(d)
      setVehicles(v)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    load()
    const interval = setInterval(load, 30000) // Auto-refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getVehicleStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'status-success'
      case 'in-transit': return 'status-warning'
      case 'maintenance': return 'status-danger'
      default: return 'status-info'
    }
  }

  return (
    <div>
      {/* Welcome Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>
              <span className="section-icon">🏠</span>
              Dashboard Overview
            </h2>
          </div>
          <button 
            onClick={load} 
            className={`btn btn-secondary ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? <span className="loading mr-2"></span> : '🔄'} Refresh
          </button>
        </div>
        
        {/* Welcome Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none'
        }}>
          <div className="card-header">
            <h3 className="card-title" style={{color: 'white', margin: 0}}>
              🚀 Welcome to SwiftTrack Professional
            </h3>
          </div>
          <div className="card-content">
            <p style={{color: 'rgba(255,255,255,0.9)', margin: '1rem 0'}}>
              Your comprehensive logistics management platform is ready. Manage orders, track deliveries, and optimize routes all in one place.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="/orders" className="btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}}>
                📦 Submit Order
              </a>
              <a href="/tracking" className="btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}}>
                🔍 Track Orders
              </a>
              <a href="/driver" className="btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}}>
                🚛 Driver Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <strong>⚠️ Connection Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !dash && (
        <section>
          <div className="card">
            <div className="flex items-center gap-4">
              <span className="loading"></span>
              <span>Loading dashboard data...</span>
            </div>
          </div>
        </section>
      )}

      {/* System Overview Metrics */}
      {dash && (
        <section>
          <h2>
            <span className="section-icon">📊</span>
            System Overview
          </h2>
          <div className="dashboard-grid">
            <div className="metric-card">
              <span className="metric-value">{dash.overview.totalOrders}</span>
              <div className="metric-label">Total Orders</div>
            </div>
            <div className="metric-card">
              <span className="metric-value">{dash.overview.activeRoutes}</span>
              <div className="metric-label">Active Routes</div>
            </div>
            <div className="metric-card">
              <span className="metric-value">{dash.overview.systemUptime}</span>
              <div className="metric-label">System Uptime</div>
            </div>
            <div className="metric-card">
              <span className="metric-value">{dash.performance.successRate}</span>
              <div className="metric-label">Success Rate</div>
            </div>
          </div>
        </section>
      )}

      {/* Performance Metrics */}
      {dash && (
        <section>
          <h2>
            <span className="section-icon">⚡</span>
            Performance Metrics
          </h2>
          <div className="grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📈 System Performance</h3>
              </div>
              <div className="card-content">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Average Processing Time</div>
                  <div className="text-lg font-semibold text-primary">{dash.performance.avgProcessingTime}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  <div className="text-lg font-semibold text-success">{dash.performance.customerSatisfaction}</div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">🎯 Route Optimization</h3>
              </div>
              <div className="card-content">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Algorithm Type</div>
                  <div className="text-sm font-medium">{dash.routeOptimization?.systemMetrics?.algorithmType || 'Advanced Routing'}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Optimization Speed</div>
                  <div className="text-lg font-semibold text-info">{dash.routeOptimization?.systemMetrics?.averageOptimizationTime || '< 200ms'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vehicle Fleet Status */}
      {vehicles && (
        <section>
          <h2>
            <span className="section-icon">🚛</span>
            Fleet Status
          </h2>
          <div className="grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📋 Fleet Summary</h3>
              </div>
              <div className="card-content">
                <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'}}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{vehicles.summary.total}</div>
                    <div className="text-xs text-gray-600 uppercase">Total Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{vehicles.summary.available}</div>
                    <div className="text-xs text-gray-600 uppercase">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{vehicles.summary.busy}</div>
                    <div className="text-xs text-gray-600 uppercase">In Transit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">{vehicles.summary.withWMSAssignments}</div>
                    <div className="text-xs text-gray-600 uppercase">WMS Assigned</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">🚐 Vehicle Details</h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {vehicles.vehicles.map(vehicle => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">🚛</div>
                        <div>
                          <div className="font-medium">{vehicle.vehicleId}</div>
                          <div className="text-xs text-gray-500">Capacity: {vehicle.capacity}kg</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status ${getVehicleStatusClass(vehicle.status)}`}>
                          <span className="status-dot"></span>
                          {vehicle.status}
                        </span>
                        {vehicle.wmsAssignment && (
                          <span className="text-xs text-gray-500">
                            WMS: {vehicle.wmsAssignment.warehouseAssignment}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* System Health */}
      {dash && (
        <section>
          <h2>
            <span className="section-icon">💚</span>
            System Health
          </h2>
          <div className="grid">
            {Object.entries(dash.systemHealth).map(([system, health]) => (
              <div key={system} className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {system.toUpperCase()} - {system === 'cms' ? 'Client Management' : system === 'ros' ? 'Route Optimization' : 'Warehouse Management'}
                  </h3>
                </div>
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <span className={`status ${health.status === 'operational' ? 'status-success' : 'status-danger'}`}>
                      <span className="status-dot"></span>
                      {health.status}
                    </span>
                    <div className="text-sm text-gray-600">
                      Uptime: <span className="font-medium">{health.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No Data State */}
      {!loading && !dash && !vehicles && (
        <section>
          <div className="alert alert-info">
            <div>
              <strong>📡 No Data Available</strong>
              <div className="mt-2 text-sm">
                Ensure the middleware service is running on <code>http://localhost:3000</code> and click the refresh button above.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
