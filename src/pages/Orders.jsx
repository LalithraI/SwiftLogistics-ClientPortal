import React, { useState } from 'react'
import { submitOrder } from '../lib/api'

export default function Orders() {
  const [orderId, setOrderId] = useState('ORD' + Math.floor(Math.random()*1000))
  const [address, setAddress] = useState('123 Main Street, Colombo')
  const [latitude, setLat] = useState(6.9271)
  const [longitude, setLng] = useState(79.8612)
  const [items, setItems] = useState('PKG001,PKG002,PKG003')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const payload = {
        orderId,
        deliveryAddress: { address, latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        items: items.split(',').map(s=>s.trim()).filter(Boolean)
      }
      const data = await submitOrder(payload)
      setResult(data)
      // Generate new order ID for next submission
      setOrderId('ORD' + Math.floor(Math.random()*1000))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const generateRandomOrder = () => {
    const addresses = [
      'Marine Drive, Colombo 03',
      'Galle Road, Mount Lavinia',
      'Kandy Road, Kegalle',
      'Matara Road, Galle',
      'Temple Road, Nugegoda'
    ]
    const coords = [
      { lat: 6.9271, lng: 79.8612 },
      { lat: 6.8344, lng: 79.8644 },
      { lat: 7.2523, lng: 80.3410 },
      { lat: 6.0535, lng: 80.2210 },
      { lat: 6.8649, lng: 79.8997 }
    ]
    const packages = ['PKG001', 'PKG002', 'PKG003', 'PKG004', 'PKG005']
    
    const randomIndex = Math.floor(Math.random() * addresses.length)
    const randomPackages = packages.slice(0, Math.floor(Math.random() * 3) + 1)
    
    setAddress(addresses[randomIndex])
    setLat(coords[randomIndex].lat)
    setLng(coords[randomIndex].lng)
    setItems(randomPackages.join(','))
    setOrderId('ORD' + Math.floor(Math.random()*1000))
  }

  return (
    <div className="container">
      <section className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Submit New Order</h1>
            <p className="text-muted mt-2">Create and submit delivery orders to our logistics network</p>
          </div>
          <button 
            type="button" 
            onClick={generateRandomOrder}
            className="btn btn-secondary"
            disabled={loading}
          >
            Generate Sample Data
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Order Details</h3>
          </div>
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <div className="grid">
                <div className="form-group">
                  <label className="form-label required" htmlFor="orderId">Order ID</label>
                  <input 
                    id="orderId"
                    className="form-control"
                    value={orderId} 
                    onChange={e=>setOrderId(e.target.value)} 
                    required
                    placeholder="Enter unique order ID"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="address">Delivery Address</label>
                  <input 
                    id="address"
                    className="form-control"
                    value={address} 
                    onChange={e=>setAddress(e.target.value)} 
                    required
                    placeholder="Full delivery address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="latitude">Latitude</label>
                  <input 
                    id="latitude"
                    className="form-control"
                    type="number" 
                    step="any" 
                    value={latitude} 
                    onChange={e=>setLat(e.target.value)} 
                    required
                    placeholder="6.9271"
                  />
                  <div className="form-help">GPS coordinate for precise location</div>
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="longitude">Longitude</label>
                  <input 
                    id="longitude"
                    className="form-control"
                    type="number" 
                    step="any" 
                    value={longitude} 
                    onChange={e=>setLng(e.target.value)} 
                    required
                    placeholder="79.8612"
                  />
                  <div className="form-help">GPS coordinate for precise location</div>
                </div>

                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label className="form-label" htmlFor="items">Package Items</label>
                  <input 
                    id="items"
                    className="form-control"
                    value={items} 
                    onChange={e=>setItems(e.target.value)} 
                    placeholder="PKG001,PKG002,PKG003 (comma-separated)"
                  />
                  <div className="form-help">
                    Enter package IDs separated by commas
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'opacity-75' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading"></span>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      🚀 Submit Order
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => {
                    setOrderId('ORD' + Math.floor(Math.random()*1000))
                    setAddress('123 Main Street, Colombo')
                    setLat(6.9271)
                    setLng(79.8612)
                    setItems('PKG001,PKG002')
                    setResult(null)
                    setError('')
                  }}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  🔄 Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mb-6">
          <strong>❌ Submission Failed:</strong> {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <section className="mb-6">
          <div className="card success-card">
            <div className="card-header">
              <h3 className="card-title text-white">
                ✅ Order Submitted Successfully
              </h3>
            </div>
            <div className="card-content">
              <div className="grid text-white">
                <div>
                  <div className="text-sm opacity-80">Order Status</div>
                  <div className="font-semibold text-lg">{result.status.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Order ID</div>
                  <div className="font-semibold text-lg">{result.orderId || orderId}</div>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <div className="text-sm opacity-80 mb-2">Tracking Information</div>
                  <div className="font-semibold">
                    Track your order: <code className="bg-secondary p-2 rounded text-primary">{result.track}</code>
                  </div>
                </div>
                {result.timestamp && (
                  <div style={{gridColumn: '1 / -1'}}>
                    <div className="text-sm opacity-80">Submitted At</div>
                    <div className="font-medium">{new Date(result.timestamp).toLocaleString()}</div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a 
                  href={`/tracking`} 
                  className="btn btn-outline-light"
                >
                  🔍 Track This Order
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Information */}
      <section>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 Order Submission Guide</h3>
          </div>
          <div className="card-content">
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="text-primary">🆔 Order ID:</strong> 
                <span className="text-muted ml-2">Must be unique. Auto-generated but customizable.</span>
              </div>
              <div>
                <strong className="text-primary">📍 Location:</strong> 
                <span className="text-muted ml-2">Provide precise latitude/longitude for accurate delivery routing.</span>
              </div>
              <div>
                <strong className="text-primary">📦 Packages:</strong> 
                <span className="text-muted ml-2">List all package IDs separated by commas.</span>
              </div>
              <div>
                <strong className="text-primary">⚡ Processing:</strong> 
                <span className="text-muted ml-2">Orders are processed immediately and integrated with our route optimization system.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
