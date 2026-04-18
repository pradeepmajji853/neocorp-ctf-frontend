/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "Phishing campaigns were tricking employees into clicking short links, so the security team shipped a 'URL Preview' service. You paste a link, the server fetches it, returns the title and first few KB — safer than a real click.",
  "The service blocked 'localhost', patted itself on the back, and launched. What the team didn't consider: 127.0.0.1, 0.0.0.0, the loopback in base-10, and — more importantly — the instance metadata service bound to the server's own interface.",
  "Two months later, forensics found the attacker had used the preview service to query the local metadata endpoint, lift IAM credentials, and pivot into cloud storage.",
  "Your mission: make the preview service fetch an internal endpoint it shouldn't be able to reach.",
]

export default function Challenge14({ apiBase }) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const preview = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const baseUrl = apiBase
      const res = await axios.post(`${baseUrl}/preview`, { url }, { withCredentials: true })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={14} title="URL Preview Service" vuln="SSRF" difficulty="easy" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP URL PREVIEW</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>fetches server-side — localhost blocked</span>
        </div>
        <form onSubmit={preview} style={{ padding: '22px' }}>
          <label style={lbl}>URL TO FETCH</label>
          <input style={inp} type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" autoComplete="off" />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Fetching…' : '{'> '} Preview'}</button>

          
        </form>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 600, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.86rem', color: '#e2e8f0', outline: 'none', marginBottom: 16 }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 600, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
