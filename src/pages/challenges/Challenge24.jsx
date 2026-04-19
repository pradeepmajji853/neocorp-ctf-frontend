import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  'The NeoCorp Heartbeat Monitor is a critical piece of infrastructure that ensures all internal nodes are responsive.',
  'It is heavily firewalled, only allowing simple GET "pings" to a strictly whitelisted range of internal IP addresses.',
  'However, an older version of the proxy engine is still in use. It treats the URL as a raw stream of characters, trusting that the traveler will only provide a path.',
  'Your handler suggests that by whispering rhythmic breaks into the address — using the language of the protocol itself — you might be able to command the monitor to perform forbidden actions on the nodes themselves.'
]

export default function Challenge24({ apiBase }) {
  const [url, setUrl] = useState('http://127.0.0.1/api/challenge24/internal/heartbeat')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/proxy`, { url })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Proxy request failed.' } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={24} title="The Forbidden Pulse" vuln="Advanced SSRF / CRLF" difficulty="very hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        <div style={panel}>
          <div style={header}>NEON-SYS HEARTBEAT MONITOR - NODE PROXY</div>
          <div style={{ padding: 22 }}>
            <div style={{ marginBottom: 18 }}>
              <div style={alertBox}>
                <span style={{ color: '#fbbf24', marginRight: 8 }}>⚠️</span>
                SECURITY POLICY: Only internal 127.0.0.1/8 addresses are permitted. All requests are logged as GET.
              </div>
            </div>

            <label style={lbl}>TARGET INTERNAL URL</label>
            <input 
              style={inp} 
              type="text"
              value={url} 
              onChange={e => setUrl(e.target.value)}
              placeholder="http://127.0.0.1/..."
            />

            <button onClick={testConnection} style={btnPrimary} disabled={loading || !url}>
              {loading ? 'Pinging Node...' : 'Send Heartbeat Ping'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)', marginTop: 22 }}>
             <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 10 }}>
              {result.ok ? '✓ PROXY LOG' : '✗ PROXY ERROR'}
            </div>
            <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const panel = { background: '#05070a', border: '1px solid #1a1b26', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }
const header = { background: '#1a1b26', padding: '14px 20px', fontSize: '0.7rem', fontWeight: 800, color: '#4fd6be', letterSpacing: '0.15em' }
const alertBox = { background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', padding: '10px 14px', borderRadius: 6, fontSize: '0.72rem', color: '#d1d5db', lineHeight: 1.5 }
const lbl = { display: 'block', fontSize: '0.65rem', color: '#565f89', marginBottom: 8, fontWeight: 700, letterSpacing: '0.05em' }
const inp = { width: '100%', background: '#13141c', border: '1px solid #24283b', borderRadius: 6, padding: '12px 14px', color: '#c0caf5', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 18, outline: 'none' }
const btnPrimary = { width: '100%', padding: '13px', border: 'none', borderRadius: 6, background: 'linear-gradient(90deg, #41a1f0, #2ac3de)', color: '#1a1b26', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }
const responseBox = { background: '#13141c', border: '1px solid #24283b', borderRadius: 8, padding: 18 }
const pre = { margin: 0, fontSize: '0.75rem', color: '#9ece6a', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: "'JetBrains Mono', monospace" }
