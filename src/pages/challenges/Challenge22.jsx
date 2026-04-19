/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  'NeoCorp has recently upgraded their authentication layer to the modern "Nexus" system.',
  'They claim it uses "Military Grade RSA-2048" asymmetric signatures, making it impossible to forge tokens without their proprietary hardware security modules.',
  'However, the hybrid gatekeeper has been configured to support several legacy ciphers for backward compatibility with their overseas offices.',
  'Your mission: find a way to forge an admin token. The system\'s public keys are supposed to be secret, but you might find them in the standard discovery paths.'
]

export default function Challenge22({ apiBase }) {
  const [token, setToken] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchToken = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/login`, { username: 'investigator' })
      setToken(res.data.token)
      setResult({ ok: true, data: { message: 'Token issued.', token: res.data.token } })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Failed to issue token.' } })
    }
    setLoading(false)
  }

  const verifyToken = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/verify`, { token })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Verification failed.' } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={22} title="The Nexus Auth Bypass" vuln="JWT Key Confusion" difficulty="very hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={panel}>
          <div style={header}>NEXUS IDENTITY GATEWAY - v4.2</div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              <button onClick={fetchToken} style={btnSecondary}>Get Standard Token</button>
              <a href={`${apiBase}/.well-known/jwks.json`} target="_blank" rel="noreferrer" style={linkBtn}>View JWKS</a>
            </div>

            <label style={lbl}>IDENTITY TOKEN (JWT)</label>
            <textarea 
              style={txtArea} 
              value={token} 
              onChange={e => setToken(e.target.value)}
              placeholder="Paste or generate your token here..."
            />

            <button onClick={verifyToken} style={btnPrimary} disabled={loading || !token}>
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)', marginTop: 20 }}>
             <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
              {result.ok ? '✓ SYSTEM RESPONSE' : '✗ SYSTEM RESPONSE'}
            </div>
            <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const panel = { background: '#0a0d17', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden' }
const header = { background: '#1e293b', padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#64748b', marginBottom: 8, fontWeight: 600 }
const txtArea = { width: '100%', height: 120, background: '#05070a', border: '1px solid #1e293b', borderRadius: 8, padding: 12, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 15, outline: 'none' }
const btnPrimary = { width: '100%', padding: '12px', border: 'none', borderRadius: 8, background: '#3b82f6', color: '#fff', fontWeight: 700, cursor: 'pointer' }
const btnSecondary = { padding: '8px 14px', border: '1px solid #3b82f6', borderRadius: 6, background: 'transparent', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }
const linkBtn = { padding: '8px 14px', border: '1px solid #475569', borderRadius: 6, background: 'transparent', color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-block' }
const responseBox = { background: '#05070a', border: '1px solid #1e293b', borderRadius: 8, padding: 15 }
const pre = { margin: 0, fontSize: '0.8rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
