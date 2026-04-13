/*
 * Challenge 8: JWT Manipulation
 * Students must decode the JWT themselves and forge it. Secret and decoded payload NOT shown.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "By Day 8, the attacker had elevated to admin-level API access. No additional login. No social engineering. Just a token, a text editor, and knowledge of how the implementation cut corners.",
  "NeoCorp's API gateway issued JSON Web Tokens. A JWT is a signed credential — but a signature is only as trustworthy as the key used to create it and the strictness of the algorithm enforcement.",
  "Forensic analysis of the attacker's traffic showed a single request: a call to the admin endpoint, bearing a JWT that looked legitimate. The server accepted it. The token had been modified.",
  "Request a token for yourself. Study its structure. Understand what the server trusts about it. Then present a token that grants you access to the admin endpoint.",
]

export default function Challenge8() {
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [tokenResult, setTokenResult] = useState(null)
  const [adminResult, setAdminResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGetToken = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post('/api/challenge8/token', { username })
      setTokenResult(res.data)
      if (res.data.token) setToken(res.data.token)
    } catch (err) { setTokenResult(err.response?.data) }
    setLoading(false)
  }

  const handleAdminAccess = async () => {
    setLoading(true); setAdminResult(null)
    try {
      const res = await axios.get('/api/challenge8/admin', { headers: { Authorization: `Bearer ${token}` } })
      setAdminResult(res.data)
    } catch (err) { setAdminResult(err.response?.data) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={8} title="API Token Manager" vuln="JWT Manipulation" difficulty="hard" backstory={BACKSTORY}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Obtain token */}
        <div style={panel}>
          <div style={sysLabel}>OBTAIN ACCESS TOKEN</div>
          <div style={{ color: '#334155', fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 12 }}>
            Authenticated API access requires a valid bearer token. Request one below.
          </div>
          <form onSubmit={handleGetToken}>
            <input style={{ ...inp, marginBottom: 10 }} type="text" placeholder="Username"
              value={username} onChange={e => setUsername(e.target.value)} />
            <button type="submit" style={{ ...btnOutline, width: '100%' }} disabled={loading}>> Request Token</button>
          </form>

          {tokenResult?.token && (
            <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 10 }}>
              <div style={{ color: '#1e293b', fontSize: '0.62rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Issued token:</div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', wordBreak: 'break-all', lineHeight: 1.7 }}>{tokenResult.token}</div>
            </div>
          )}
        </div>

        {/* Access admin endpoint */}
        <div style={panel}>
          <div style={sysLabel}>ADMIN ENDPOINT ACCESS</div>
          <div style={{ color: '#334155', fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 12 }}>
            The admin endpoint validates the bearer token in the <code style={code}>Authorization</code> header.
            Paste your token below — original or modified.
          </div>
          <textarea style={{ ...inp, resize: 'vertical', marginBottom: 10, fontSize: '0.72rem', wordBreak: 'break-all' }}
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Bearer token..."
            rows={5}
          />
          <button onClick={handleAdminAccess} style={{ ...btnPrimary, width: '100%' }} disabled={loading || !token}>
            {loading ? '...' : '> Call Admin Endpoint'}
          </button>

          {adminResult && (
            <div style={{ marginTop: 12, background: adminResult.flag ? 'rgba(52,211,153,0.05)' : 'rgba(248,113,113,0.05)', border: `1px solid ${adminResult.flag ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.15)'}`, borderRadius: 6, padding: 12 }}>
              {adminResult.flag && <div style={{ color: '#34d399', fontSize: '0.68rem', marginBottom: 6 }}>🎯 ADMIN ACCESS GRANTED</div>}
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', color: adminResult.flag ? '#34d399' : '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(adminResult, null, 2)}
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
const code = { color: '#38bdf8', background: 'rgba(56,189,248,0.08)', padding: '1px 5px', borderRadius: 3, fontSize: '0.9em' }
