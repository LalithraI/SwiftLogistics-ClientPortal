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
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2>
          <span className="section-icon">📦</span>
          Submit New Order
        </h2>
        <button 
          type="button" 
          onClick={generateRandomOrder}
          className="btn btn-secondary"
          disabled={loading}
        >
          🎲 Generate Sample
        </button>
      </div>

      <form onSubmit={onSubmit} className="form">
        <div className="grid">
          <div className="form-group">
            <label htmlFor="orderId">Order ID</label>
            <input 
              id="orderId"
              value={orderId} 
              onChange={e=>setOrderId(e.target.value)} 
              required
              placeholder="Enter unique order ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <input 
              id="address"
              value={address} 
              onChange={e=>setAddress(e.target.value)} 
              required
              placeholder="Full delivery address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input 
              id="latitude"
              type="number" 
              step="any" 
              value={latitude} 
              onChange={e=>setLat(e.target.value)} 
              required
              placeholder="6.9271"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input 
              id="longitude"
              type="number" 
              step="any" 
              value={longitude} 
              onChange={e=>setLng(e.target.value)} 
              required
              placeholder="79.8612"
            />
          </div>

          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label htmlFor="items">Package Items</label>
            <input 
              id="items"
              value={items} 
              onChange={e=>setItems(e.target.value)} 
              placeholder="PKG001,PKG002,PKG003 (comma-separated)"
            />
            <div className="text-xs text-gray-500 mt-1">
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
                <span className="loading mr-2"></span>
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

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <strong>❌ Submission Failed:</strong> {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          marginTop: '2rem'
        }}>
          <div className="card-header">
            <h3 className="card-title" style={{color: 'white', margin: 0}}>
              ✅ Order Submitted Successfully
            </h3>
          </div>
          <div className="card-content">
            <div className="grid" style={{color: 'rgba(255,255,255,0.9)'}}>
              <div>
                <div className="text-sm opacity-80">Order Status</div>
                <div className="font-semibold text-lg">{result.status.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-sm opacity-80">Order ID</div>
                <div className="font-semibold text-lg">{result.orderId || orderId}</div>
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <div className="text-sm opacity-80">Tracking Information</div>
                <div className="font-semibold">
                  Track your order: <code style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}>{result.track}</code>
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
                className="btn" 
                style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}}
              >
                🔍 Track This Order
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">📋 Order Submission Guide</h3>
        </div>
        <div className="card-content text-sm text-gray-600">
          <div className="grid gap-4">
            <div>
              <strong className="text-gray-800">🆔 Order ID:</strong> Must be unique. Auto-generated but customizable.
            </div>
            <div>
              <strong className="text-gray-800">📍 Location:</strong> Provide precise latitude/longitude for accurate delivery routing.
            </div>
            <div>
              <strong className="text-gray-800">📦 Packages:</strong> List all package IDs separated by commas.
            </div>
            <div>
              <strong className="text-gray-800">⚡ Processing:</strong> Orders are processed immediately and integrated with our route optimization system.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
