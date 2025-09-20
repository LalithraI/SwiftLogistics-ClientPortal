import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function BackendStatus() {
  const [status, setStatus] = useState({ ok: null, msg: 'Initializing...', lastCheck: null })
  const [isChecking, setIsChecking] = useState(false)

  async function check() {
    if (isChecking) return
    
    setIsChecking(true)
    setStatus(prev => ({ ...prev, msg: 'Checking connection...' }))
    
    try {
      const startTime = Date.now()
      const res = await fetch(`${API_BASE}/health`, { 
        method: 'GET',
        timeout: 5000 
      })
      const responseTime = Date.now() - startTime
      
      if (res.ok) {
        const data = await res.json()
        setStatus({
          ok: true,
          msg: `Connected • ${responseTime}ms`,
          lastCheck: new Date(),
          service: data.service
        })
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch (e) {
      setStatus({
        ok: false,
        msg: 'Connection failed',
        lastCheck: new Date(),
        error: e.message
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    check()
    const interval = setInterval(check, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusClass = () => {
    if (status.ok === null) return 'status status-info'
    return status.ok ? 'status status-success' : 'status status-danger'
  }

  const getStatusIcon = () => {
    if (isChecking) return '⟳'
    if (status.ok === null) return '○'
    return status.ok ? '●' : '●'
  }

  return (
    <div 
      className={getStatusClass()}
      title={`Click to refresh • Last check: ${status.lastCheck?.toLocaleTimeString() || 'Never'}`}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={check}
    >
      <span className={`status-dot ${isChecking ? 'loading' : ''}`}>
        {getStatusIcon()}
      </span>
      <span className="text-xs font-medium">
        {status.msg}
      </span>
    </div>
  )
}
