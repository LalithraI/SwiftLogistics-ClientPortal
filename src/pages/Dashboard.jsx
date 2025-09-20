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
    <div className="container">
      {/* Welcome Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">SwiftTrack Dashboard</h1>
            <p className="text-lg text-muted mt-2">Monitor your logistics operations in real-time</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={load} 
              className={`btn btn-secondary ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : '🔄'} Refresh Data
            </button>
          </div>
        </div>

        {/* Key Metrics - Always Visible */}
        <div className="dashboard-grid mb-6">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="metric-value">{dash?.overview?.totalOrders || '0'}</span>
                <div className="metric-label">Total Orders Today</div>
              </div>
              <div className="text-2xl text-primary">📦</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="metric-value">{dash?.overview?.activeRoutes || '0'}</span>
                <div className="metric-label">Active Routes</div>
              </div>
              <div className="text-2xl text-success">🚛</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="metric-value">{dash?.overview?.systemUptime || '99.9%'}</span>
                <div className="metric-label">System Uptime</div>
              </div>
              <div className="text-2xl text-info">⚡</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="metric-value">{dash?.performance?.successRate || '98.5%'}</span>
                <div className="metric-label">Success Rate</div>
              </div>
              <div className="text-2xl text-warning">🎯</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="flex flex-wrap gap-3">
              <a href="/orders" className="btn btn-primary">
                Create New Order
              </a>
              <a href="/tracking" className="btn btn-secondary">
                Track Shipments
              </a>
              <a href="/driver" className="btn btn-info">
                Driver Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mb-6">
          <strong>⚠️ Connection Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !dash && (
        <section className="mb-6">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center gap-4 justify-center p-6">
                <span className="loading"></span>
                <span className="text-muted">Loading dashboard data...</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* System Overview */}
      {!dash && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">System Overview</h2>
          <div className="grid gap-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Platform Status</h3>
              </div>
              <div className="card-content">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="font-medium">Client Portal</span>
                    </div>
                    <span className="text-success text-sm">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${dash ? 'bg-success' : 'bg-warning'} rounded-full`}></div>
                      <span className="font-medium">Middleware Services</span>
                    </div>
                    <span className={`${dash ? 'text-success' : 'text-warning'} text-sm`}>
                      {dash ? 'Connected' : 'Connecting...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-info rounded-full"></div>
                      <span className="font-medium">Database</span>
                    </div>
                    <span className="text-info text-sm">Ready</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Platform Features</h3>
              </div>
              <div className="card-content">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">📊</div>
                    <div>
                      <div className="font-medium">Real-time Analytics</div>
                      <div className="text-muted">Monitor system performance and metrics</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center text-white text-sm">🚛</div>
                    <div>
                      <div className="font-medium">Fleet Management</div>
                      <div className="text-muted">Track vehicles and optimize routes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center text-white text-sm">📦</div>
                    <div>
                      <div className="font-medium">Order Processing</div>
                      <div className="text-muted">Automated workflow management</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center text-white text-sm">⚡</div>
                    <div>
                      <div className="font-medium">System Integration</div>
                      <div className="text-muted">CMS, ROS, and WMS connectivity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Performance Metrics */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-4">
          Performance & Analytics
        </h2>
        <div className="grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">System Performance</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Average Processing Time</span>
                  <span className="text-lg font-semibold text-primary">
                    {dash?.performance?.avgProcessingTime || '< 200ms'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Customer Satisfaction</span>
                  <span className="text-lg font-semibold text-success">
                    {dash?.performance?.customerSatisfaction || '98.5%'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Response Time</span>
                  <span className="text-lg font-semibold text-info">
                    {dash?.performance?.responseTime || '< 100ms'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Route Optimization</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Algorithm Type</span>
                  <span className="text-sm font-medium">
                    {dash?.routeOptimization?.systemMetrics?.algorithmType || 'Advanced AI Routing'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Optimization Speed</span>
                  <span className="text-lg font-semibold text-info">
                    {dash?.routeOptimization?.systemMetrics?.averageOptimizationTime || '< 200ms'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Route Efficiency</span>
                  <span className="text-lg font-semibold text-success">
                    {dash?.routeOptimization?.efficiency || '94.2%'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Today's Activity</h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Orders Processed</span>
                  <span className="text-lg font-semibold text-primary">
                    {dash?.daily?.ordersProcessed || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Deliveries Completed</span>
                  <span className="text-lg font-semibold text-success">
                    {dash?.daily?.deliveriesCompleted || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Active Drivers</span>
                  <span className="text-lg font-semibold text-info">
                    {dash?.daily?.activeDrivers || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Fleet Status */}
      {vehicles && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
            <span className="section-icon">🚛</span>
            Fleet Status
          </h2>
          <div className="grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📋 Fleet Summary</h3>
              </div>
              <div className="card-content">
                <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'}}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{vehicles.summary.total}</div>
                    <div className="text-xs text-muted uppercase font-medium">Total Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">{vehicles.summary.available}</div>
                    <div className="text-xs text-muted uppercase font-medium">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">{vehicles.summary.busy}</div>
                    <div className="text-xs text-muted uppercase font-medium">In Transit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-info">{vehicles.summary.withWMSAssignments}</div>
                    <div className="text-xs text-muted uppercase font-medium">WMS Assigned</div>
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
                    <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">🚛</div>
                        <div>
                          <div className="font-medium text-primary">{vehicle.vehicleId}</div>
                          <div className="text-xs text-muted">Capacity: {vehicle.capacity}kg</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status ${getVehicleStatusClass(vehicle.status)}`}>
                          <span className="status-dot"></span>
                          {vehicle.status}
                        </span>
                        {vehicle.wmsAssignment && (
                          <span className="text-xs text-muted">
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
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
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
                    <div className="text-sm text-muted">
                      Uptime: <span className="font-medium text-primary">{health.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Getting Started Guide - No Data State */}
      {!loading && !dash && !vehicles && (
        <section className="mb-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Getting Started with SwiftTrack</h3>
            </div>
            <div className="card-content">
              <div className="alert alert-info mb-4">
                <strong>Welcome to SwiftTrack!</strong> To see live data, ensure the middleware service is running on port 3000.
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Start Backend Services</h4>
                    <p className="text-sm text-muted mb-2">Launch the middleware integration server</p>
                    <code className="text-xs bg-primary text-white px-2 py-1 rounded">
                      cd SwiftLogistics-Middleware && node middleware-integration.js
                    </code>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Submit Your First Order</h4>
                    <p className="text-sm text-muted mb-2">Create orders to populate the dashboard</p>
                    <a href="/orders" className="btn btn-sm btn-primary">Create Order</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                  <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Track Progress</h4>
                    <p className="text-sm text-muted mb-2">Monitor orders and system performance</p>
                    <a href="/tracking" className="btn btn-sm btn-secondary">Track Orders</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
