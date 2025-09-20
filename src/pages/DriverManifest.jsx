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
    <section>
      <h2>
        <span className="section-icon">🚛</span>
        Driver Manifest
      </h2>
      
      {loading && (
        <div className="flex items-center gap-3 p-4">
          <span className="loading"></span>
          <span>Loading your delivery manifest...</span>
        </div>
      )}

      {clientId && manifest && (
        <div className="space-y-6">
          {/* Driver Info Card */}
          <div className="card">
            <h3 className="card-title">👨‍💼 Driver Information</h3>
            <div className="card-content">
              <div className="grid">
                <div>
                  <p><strong>Driver ID:</strong> {manifest.driverId}</p>
                  <p><strong>Vehicle:</strong> {manifest.vehicleId}</p>
                  <p><strong>Date:</strong> {manifest.date}</p>
                </div>
                <div>
                  <p><strong>Total Deliveries:</strong> {manifest.deliveries.length}</p>
                  <p><strong>Completed:</strong> {manifest.deliveries.filter(d => d.status === 'delivered').length}</p>
                  <p><strong>Remaining:</strong> {manifest.deliveries.filter(d => d.status === 'pending').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery List */}
          <div className="card">
            <h3 className="card-title">📦 Today's Deliveries</h3>
            <div className="card-content">
              <div className="space-y-3">
                {manifest.deliveries.map((delivery, index) => (
                  <div key={delivery.orderId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        delivery.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{delivery.orderId}</div>
                        <div className="text-sm text-gray-600">📍 {delivery.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`status ${delivery.status === 'delivered' ? 'status-success' : 'status-warning'}`}>
                        <span className="status-dot"></span>
                        {delivery.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        delivery.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
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
          <div className="card-content text-center">
            <h3 className="text-lg font-semibold mb-2">No Deliveries Today</h3>
            <p className="text-gray-600">You have no scheduled deliveries for today.</p>
          </div>
        </div>
      )}

      {!clientId && (
        <div>
          <div className="alert alert-info">
            <strong>👋 Welcome Driver!</strong> Please log in to view your delivery manifest.
          </div>
          
          <div className="card mt-6">
            <h3 className="card-title">🚛 Driver Features</h3>
            <div className="card-content">
              <div className="grid gap-4 text-sm">
                <div>
                  <strong>📋 Daily Manifest:</strong> View your complete delivery schedule
                </div>
                <div>
                  <strong>📍 Route Optimization:</strong> Deliveries organized by location
                </div>
                <div>
                  <strong>📱 Mobile Friendly:</strong> Easy access from your mobile device
                </div>
                <div>
                  <strong>✅ Status Updates:</strong> Mark deliveries as completed
                </div>
                <div>
                  <strong>🔔 Priority Alerts:</strong> High-priority deliveries highlighted
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
