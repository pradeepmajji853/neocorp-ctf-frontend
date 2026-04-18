/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  'Three weeks ago, NeoCorp — a mid-sized fintech company — suffered an unexplained data exfiltration. The attacker moved laterally through their systems for 11 days before being detected.',
  'Your handler at Cyberminace has secured access to a clone of their internal employee portal, rebuilt in the same environment the attacker first entered through.',
  'The portal was written by a contractor who was let go before a security review was ever conducted. The login form talks directly to a SQLite database — and the queries are built by hand.',
  'Your mission: bypass authentication without valid credentials. The admin account holds the first piece of evidence.',
]

export default function Challenge1() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await axios.post('/api/challenge1/login', { username, password }, { withCredentials: true })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Request failed.' } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={1} title="The Breach Begins" vuln="SQL Injection" difficulty="easy" backstory={BACKSTORY}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={portal}>
          {/* Portal header */}
          <div style={portalHeader}>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', letterSpacing: '0.1em', fontWeight: 700 }}>
              NEOCORP EMPLOYEE PORTAL
            </div>
            <div style={{ color: '#334155', fontSize: '0.7rem', marginTop: 3 }}>
              v1.0.3 · Authorized personnel only
            </div>
          </div>

          <div style={{ padding: '26px 22px' }}>
            <form onSubmit={handleLogin}>
              <label style={lbl}>USERNAME</label>
              <input style={{ ...inp, marginBottom: 12 }} type="text" value={username}
                onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoComplete="off" />

              <label style={lbl}>PASSWORD</label>
              <input style={{ ...inp, marginBottom: 18 }} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="off" />

              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? 'Authenticating...' : '>  Sign In'}
              </button>
            </form>
            <div style={{ marginTop: 14, color: '#1e293b', fontSize: '0.68rem', textAlign: 'center' }}>
              Contact IT support for access issues — ext. 4400
            </div>
          </div>
        </div>

        {result && (
          <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)', marginTop: 20 }}>
            <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
              {result.ok ? '✓ SERVER RESPONSE' : '✗ SERVER RESPONSE'}
            </div>
            <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const portal = { background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 40px rgba(0,0,0,0.5)' }
const portalHeader = { padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none' }
const btnPrimary = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }
const responseBox = { background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
