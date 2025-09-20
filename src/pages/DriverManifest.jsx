import React, { useState, useEffect } from 'react'
import { getClientId } from '../lib/api'

export default function DriverManifest() {
  const clientId = getClientId()
  const [loading, setLoading] = useState(false)
  const [manifest, setManifest] = useState(null)

  useEffect(() => {
    if (clientId) {
      setLoading(true)
      // Simulate loading delivery manifest
      setTimeout(() => {
        setManifest({
          driverId: `DRIVER_${clientId}`,
          vehicleId: 'VH001',
          date: new Date().toLocaleDateString(),
          deliveries: [
            { orderId: 'ORD001', address: 'Colombo 03', status: 'delivered', priority: 'high' },
            { orderId: 'ORD002', address: 'Galle Road', status: 'delivered', priority: 'normal' },
            { orderId: 'ORD003', address: 'Kandy City', status: 'pending', priority: 'high' },
            { orderId: 'ORD004', address: 'Nugegoda', status: 'pending', priority: 'normal' }
          ]
        })
        setLoading(false)
      }, 1000)
    }
  }, [clientId])

  return (
    <div className="container">
      <section className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Driver Manifest</h1>
          <p className="text-muted mt-2">Your daily delivery schedule and route information</p>
        </div>
        
        {loading && (
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-center gap-3 p-6">
                <span className="loading"></span>
                <span className="text-muted">Loading your delivery manifest...</span>
              </div>
            </div>
          </div>
        )}

        {clientId && manifest && (
          <div className="space-y-6">
            {/* Driver Info Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">👨‍💼 Driver Information</h3>
              </div>
              <div className="card-content">
                <div className="grid">
                  <div className="space-y-2">
                    <div><strong className="text-primary">Driver ID:</strong> <span className="font-mono">{manifest.driverId}</span></div>
                    <div><strong className="text-primary">Vehicle:</strong> {manifest.vehicleId}</div>
                    <div><strong className="text-primary">Date:</strong> {manifest.date}</div>
                  </div>
                  <div className="space-y-2">
                    <div><strong className="text-primary">Total Deliveries:</strong> <span className="font-semibold">{manifest.deliveries.length}</span></div>
                    <div><strong className="text-success">Completed:</strong> <span className="font-semibold">{manifest.deliveries.filter(d => d.status === 'delivered').length}</span></div>
                    <div><strong className="text-warning">Remaining:</strong> <span className="font-semibold">{manifest.deliveries.filter(d => d.status === 'pending').length}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery List */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📦 Today's Deliveries</h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {manifest.deliveries.map((delivery, index) => (
                    <div key={delivery.orderId} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:shadow transition">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          delivery.status === 'delivered' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-primary">{delivery.orderId}</div>
                          <div className="text-sm text-muted">📍 {delivery.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status ${delivery.status === 'delivered' ? 'status-success' : 'status-warning'}`}>
                          <span className="status-dot"></span>
                          {delivery.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          delivery.priority === 'high' ? 'bg-danger-bg text-danger' : 'bg-info-bg text-info'
                        }`}>
                          {delivery.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {clientId && !manifest && !loading && (
          <div className="card">
            <div className="card-content text-center p-8">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-primary mb-2">No Deliveries Today</h3>
              <p className="text-muted">You have no scheduled deliveries for today.</p>
            </div>
          </div>
        )}

        {!clientId && (
          <div className="space-y-6">
            <div className="alert alert-info">
              <strong>👋 Welcome Driver!</strong> Please log in to view your delivery manifest.
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">🚛 Driver Features</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-primary">📋</span>
                    <div>
                      <strong className="text-primary">Daily Manifest:</strong>
                      <div className="text-muted">View your complete delivery schedule</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">📍</span>
                    <div>
                      <strong className="text-primary">Route Optimization:</strong>
                      <div className="text-muted">Deliveries organized by location</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">📱</span>
                    <div>
                      <strong className="text-primary">Mobile Friendly:</strong>
                      <div className="text-muted">Easy access from your mobile device</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">✅</span>
                    <div>
                      <strong className="text-primary">Status Updates:</strong>
                      <div className="text-muted">Mark deliveries as completed</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">🔔</span>
                    <div>
                      <strong className="text-primary">Priority Alerts:</strong>
                      <div className="text-muted">High-priority deliveries highlighted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
