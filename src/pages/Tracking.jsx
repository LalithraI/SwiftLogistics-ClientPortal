import React, { useEffect, useState } from 'react'
import { getOrderStatus } from '../lib/api'

export default function Tracking() {
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [history, setHistory] = useState([])

  async function fetchStatus(id, showLoading = true) {
    if (showLoading) setLoading(true)
    setError('')
    try {
      const data = await getOrderStatus(id)
      setStatus(data)
      
      // Add to history if new status
      if (data && !history.find(h => h.orderId === id)) {
        setHistory(prev => [...prev.slice(-4), { ...data, searchedAt: new Date().toISOString() }])
      }
    } catch (e) {
      setError(e.message)
      setStatus(null)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    let t
    if (polling && orderId) {
      const poll = async () => {
        await fetchStatus(orderId, false) // Don't show loading for auto-refresh
        t = setTimeout(poll, 5000) // Poll every 5 seconds
      }
      poll()
    }
    return () => clearTimeout(t)
  }, [polling, orderId])

  const getStatusColor = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'processed': return 'status-success'
      case 'processing': return 'status-warning'
      case 'received': return 'status-info'
      case 'failed': return 'status-danger'
      default: return 'status-info'
    }
  }

  const getStatusEmoji = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'processed': return '✅'
      case 'processing': return '⏳'
      case 'received': return '📨'
      case 'failed': return '❌'
      default: return '📄'
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  const quickTrack = (id) => {
    setOrderId(id)
    fetchStatus(id)
  }

  return (
    <section>
      <h2>
        <span className="section-icon">🔍</span>
        Order Tracking
      </h2>

      {/* Search Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Track Your Order</h3>
        </div>
        <div className="card-content">
          <div className="flex gap-4 items-end">
            <div className="flex-1 form-group">
              <label htmlFor="orderIdInput">Order ID</label>
              <input 
                id="orderIdInput"
                placeholder="Enter Order ID (e.g., ORD123, TEST001)" 
                value={orderId} 
                onChange={e=>setOrderId(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && orderId && fetchStatus(orderId)}
              />
            </div>
            
            <button 
              onClick={() => fetchStatus(orderId)} 
              disabled={!orderId || loading}
              className={`btn btn-primary ${loading ? 'opacity-75' : ''}`}
            >
              {loading ? (
                <>
                  <span className="loading mr-2"></span>
                  Tracking...
                </>
              ) : (
                '🔍 Track Order'
              )}
            </button>
          </div>

          <div className="flex items-center mt-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={polling} 
                onChange={e=>setPolling(e.target.checked)}
                disabled={!orderId}
              />
              <span className="text-sm text-gray-700">
                {polling ? '🔄 Auto-refreshing every 5s' : '⏸️ Auto-refresh disabled'}
              </span>
            </label>
            
            {polling && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="loading" style={{width: '12px', height: '12px'}}></span>
                Live tracking active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <strong>🚫 Tracking Error:</strong> {error}
          <div className="text-sm mt-2">
            Please check the Order ID and ensure it exists in the system.
          </div>
        </div>
      )}

      {/* Order Status Result */}
      {status && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              {getStatusEmoji(status.status)} Order Status: {status.orderId}
            </h3>
          </div>
          <div className="card-content">
            <div className="grid">
              <div className="form-group">
                <label>Current Status</label>
                <div className={`status ${getStatusColor(status.status)}`}>
                  <span className="status-dot"></span>
                  {status.status.toUpperCase()}
                </div>
              </div>

              <div className="form-group">
                <label>Order ID</label>
                <div className="font-mono text-lg font-semibold text-primary">{status.orderId}</div>
              </div>

              <div className="form-group">
                <label>Received At</label>
                <div className="text-gray-700">
                  {new Date(status.receivedAt).toLocaleString()}
                </div>
              </div>

              <div className="form-group">
                <label>Last Updated</label>
                <div className="text-gray-700">
                  {new Date(status.lastUpdated).toLocaleString()}
                </div>
              </div>

              {status.error && (
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Error Details</label>
                  <div className="alert alert-error">
                    {status.error}
                  </div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">📈 Status Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center text-white text-sm">1</div>
                  <div className="flex-1">
                    <div className="font-medium">Order Received</div>
                    <div className="text-sm text-gray-600">{new Date(status.receivedAt).toLocaleString()}</div>
                  </div>
                  <span className="status status-success"><span className="status-dot"></span>Completed</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    ['processing', 'processed'].includes(status.status.toLowerCase()) ? 'bg-warning' : 'bg-gray-400'
                  }`}>2</div>
                  <div className="flex-1">
                    <div className="font-medium">Processing & Route Optimization</div>
                    <div className="text-sm text-gray-600">Integrating with ROS and WMS systems</div>
                  </div>
                  <span className={`status ${
                    status.status.toLowerCase() === 'processing' ? 'status-warning' :
                    status.status.toLowerCase() === 'processed' ? 'status-success' :
                    'status-info'
                  }`}>
                    <span className="status-dot"></span>
                    {['processing', 'processed'].includes(status.status.toLowerCase()) ? 
                      (status.status.toLowerCase() === 'processed' ? 'Completed' : 'In Progress') : 
                      'Pending'}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    status.status.toLowerCase() === 'processed' ? 'bg-success' : 'bg-gray-400'
                  }`}>3</div>
                  <div className="flex-1">
                    <div className="font-medium">Ready for Dispatch</div>
                    <div className="text-sm text-gray-600">Vehicle assignment and route finalization</div>
                  </div>
                  <span className={`status ${status.status.toLowerCase() === 'processed' ? 'status-success' : 'status-info'}`}>
                    <span className="status-dot"></span>
                    {status.status.toLowerCase() === 'processed' ? 'Ready' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search History */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 Recent Searches</h3>
            <button onClick={clearHistory} className="btn-secondary text-sm">Clear History</button>
          </div>
          <div className="card-content">
            <div className="grid gap-3">
              {history.map((item, index) => (
                <div 
                  key={`${item.orderId}-${index}`} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => quickTrack(item.orderId)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusEmoji(item.status)}</span>
                    <div>
                      <div className="font-medium">{item.orderId}</div>
                      <div className="text-xs text-gray-500">
                        Searched: {new Date(item.searchedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status ${getStatusColor(item.status)}`}>
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                    <button className="text-primary hover:text-primary-dark">
                      🔍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      {!status && !error && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💡 Tracking Help</h3>
          </div>
          <div className="card-content text-sm text-gray-600">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">🆔</span>
                <div>
                  <strong className="text-gray-800">Order ID Format:</strong> 
                  <div>Use the Order ID provided after order submission (e.g., ORD123, TEST001)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔄</span>
                <div>
                  <strong className="text-gray-800">Auto-Refresh:</strong> 
                  <div>Enable to automatically check for status updates every 5 seconds</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <strong className="text-gray-800">Status Types:</strong> 
                  <div>Received → Processing → Processed → Ready for Dispatch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
