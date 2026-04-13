import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(username, password)
      } else {
        await login(username, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    }
    setLoading(false)
  }

  return (
    <div style={page}>
      {/* Background grid */}
      <div style={gridOverlay} />

      <div style={container}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={logoRow}>
            <div style={logoBadge}>&#9889;</div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.14em' }}>CYBERMINDSPACE</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#e2e8f0', marginTop: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            {isRegister ? 'Create Account' : 'Operative Login'}
          </h1>
          <p style={{ color: '#475569', fontSize: '0.82rem', marginTop: 6 }}>
            {isRegister ? 'Register to begin the CTF challenges.' : 'Authenticate to access the training environment.'}
          </p>
        </div>

        {/* Form card */}
        <div style={card}>
          <form onSubmit={handleSubmit}>
            <label style={lbl}>USERNAME</label>
            <input
              style={inp}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter callsign"
              autoComplete="off"
              autoFocus
            />

            <label style={{ ...lbl, marginTop: 14 }}>PASSWORD</label>
            <input
              style={inp}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isRegister ? 'Min 6 characters' : 'Enter password'}
              autoComplete="off"
            />

            {error && (
              <div style={errBox}>{error}</div>
            )}

            <button type="submit" style={btn} disabled={loading}>
              {loading ? 'Processing...' : isRegister ? '> Register' : '> Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              style={toggleBtn}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const page = {
  minHeight: '100vh',
  background: '#080d1a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  position: 'relative',
  overflow: 'hidden',
}
const gridOverlay = {
  position: 'absolute', inset: 0,
  backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
  backgroundSize: '44px 44px',
  pointerEvents: 'none',
}
const container = { position: 'relative', width: '100%', maxWidth: 400, padding: '0 20px' }
const logoRow = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
const logoBadge = {
  width: 26, height: 26, borderRadius: 6,
  background: 'linear-gradient(135deg,#3b82f6,#818cf8)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 13, boxShadow: '0 0 14px rgba(59,130,246,0.4)',
}
const card = {
  background: '#0b1120',
  border: '1px solid rgba(59,130,246,0.12)',
  borderRadius: 10,
  padding: '28px 24px',
  boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
}
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = {
  display: 'block', width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(59,130,246,0.15)',
  borderRadius: 6, padding: '11px 13px',
  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none',
}
const btn = {
  width: '100%', marginTop: 20, padding: '12px',
  border: 'none', borderRadius: 6, cursor: 'pointer',
  background: 'linear-gradient(135deg,#3b82f6,#818cf8)',
  color: '#fff', fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.88rem', fontWeight: 700,
  boxShadow: '0 0 20px rgba(59,130,246,0.3)',
}
const errBox = {
  marginTop: 14, padding: '10px 12px',
  background: 'rgba(248,113,113,0.08)',
  border: '1px solid rgba(248,113,113,0.2)',
  borderRadius: 6, color: '#f87171', fontSize: '0.8rem',
}
const toggleBtn = {
  background: 'none', border: 'none', color: '#3b82f6',
  cursor: 'pointer', fontSize: '0.78rem',
  fontFamily: "'JetBrains Mono', monospace",
}
