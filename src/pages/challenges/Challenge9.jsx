/*
 
 * Students must discover /hidden-admin-v2 themselves via robots.txt or source code.
 * 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The breach timeline from Day 9 shows the attacker connecting to a path that doesn't appear anywhere in NeoCorp's published documentation, navigation, or internal wikis. It shouldn't have been findable.",
  "The development team had deployed a legacy admin panel during a rushed migration two years prior. It was never formally decommissioned — just quietly forgotten. No one audited what files were left on the server.",
  "Standard web servers and search engines use a convention to communicate which paths should remain unindexed. Attackers know to look here first. Developers rarely think to clean it up.",
  "Find the hidden endpoint. Access it. The deployment credentials were never rotated from the seeded defaults.",
]

export default function Challenge9() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginResult, setLoginResult] = useState(null)
  const [dashResult, setDashResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post('/hidden-admin-v2/login', { username, password }, { withCredentials: true })
      setLoginResult(res.data)
    } catch (err) { setLoginResult(err.response?.data || { error: 'Login failed' }) }
    setLoading(false)
  }

  const handleDashboard = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/hidden-admin-v2/dashboard', { withCredentials: true })
      setDashResult(res.data)
    } catch (err) { setDashResult(err.response?.data || { error: 'Unauthorized' }) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={9} title="NeoCorp Systems" vuln="Hidden Panel Discovery" difficulty="hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 520 }}>
        <div style={sysLabel}>NEOCORP SYSTEMS — AUTHENTICATED ACCESS</div>
        <div style={{ color: '#334155', fontSize: '0.75rem', lineHeight: 1.7, marginBottom: 24 }}>
          Once you have located the hidden endpoint, use this interface to authenticate and access the restricted dashboard.
          The endpoint URL and default credentials must be discovered independently.
        </div>

        <div style={panel}>
          <div style={sysLabel}>PANEL LOGIN</div>
          <form onSubmit={handleLogin}>
            <input style={{ ...inp, marginBottom: 10 }} type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)} />
            <input style={{ ...inp, marginBottom: 12 }} type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ ...btnPrimary, flex: 1 }} disabled={loading}>{'> '} Login</button>
              <button type="button" onClick={handleDashboard} style={{ ...btnOutline, flex: 1 }} disabled={loading}>{'> '} Dashboard</button>
            </div>
          </form>

          {loginResult && (
            <div style={{ marginTop: 14, background: loginResult.flag ? 'rgba(52,211,153,0.05)' : 'rgba(248,113,113,0.05)', border: `1px solid ${loginResult.flag ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.15)'}`, borderRadius: 6, padding: 12 }}>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', color: loginResult.flag ? '#34d399' : '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(loginResult, null, 2)}
              </pre>
            </div>
          )}

          {dashResult && (
            <div style={{ marginTop: 10, background: 'rgba(11,17,32,0.8)', border: `1px solid ${dashResult.flag ? 'rgba(52,211,153,0.15)' : 'rgba(59,130,246,0.08)'}`, borderRadius: 6, padding: 12 }}>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', color: dashResult.flag ? '#34d399' : '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(dashResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const panel = { background: 'rgba(11,17,32,0.8)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10, padding: 20 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none' }
const btnPrimary = { padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', fontWeight: 700 }
const btnOutline = { padding: '10px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
