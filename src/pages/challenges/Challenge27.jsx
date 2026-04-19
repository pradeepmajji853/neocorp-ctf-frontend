/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's 'Event Horizon' proxy is designed to safely probe remote systems and cloud nodes. It handles protocol translation and enforces a strict hostname blocklist to prevent reaching internal services.",
  "Security researchers claim that SSRF (Server-Side Request Forgery) is dead in modern environments because of these strict filters. But NeoCorp's proxy has a dark secret: it supports the ancient `gopher://` protocol for legacy cloud compatibility.",
  "Gopher allows raw TCP communication to arbitrary ports. If an attacker can bypass the hostname check, they can use Gopher to talk to internal services like Redis or Memcached — which usually don't require authentication on the local network.",
  "Your mission: Bypass the filter and reach the internal Redis instance at `127.0.0.1:6379`. You need to set the key `system:unlock` to the value `omega-7-alpha` to trigger the automated flag release.",
]

export default function Challenge27({ apiBase }) {
  const [url, setUrl] = useState('https://neocorp.io/health')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const call = async (method, path, data = null) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await axios({
        method,
        url: `${apiBase}${path}`,
        data: data ? { url: data } : null,
        withCredentials: true
      })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  const handleValidate = (e) => {
    e.preventDefault()
    call('post', '/validate-node', url)
  }

  return (
    <ChallengeShell id={27} title="The Event Horizon" vuln="Advanced SSRF & Protocol Smuggling" difficulty="extreme" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#fbbf24', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>EVENT HORIZON :: PROXY DISPATCHER v9.1</span>
          <span style={{ color: '#444', fontSize: '0.68rem', fontWeight: 700 }}>BLOCKLIST: ENABLED // PROTOCOLS: HTTP,HTTPS,GOPHER</span>
        </div>

        <div style={{ padding: 22 }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 15 }}>
            Submit a remote URL to validate connectivity. Hostnames like 'localhost' and '127.0.0.1' are explicitly blocked by the security kernel.
          </div>

          <form onSubmit={handleValidate}>
            <label style={lbl}>REACHABILITY TARGET (URL)</label>
            <input 
              type="text" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              style={inp} 
              placeholder="https://external-node.io/api"
              autoComplete="off"
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button type="submit" style={btn} disabled={loading || !url}>
                {loading ? 'Dispatching…' : '>  POST /validate-node'}
              </button>
              <button type="button" onClick={() => call('get', '/status')} style={btnSecondary} disabled={loading}>
                GET /status
              </button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 6 }}>PROXY_DISPATCH_LOG</div>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          
          {(result.data?.response_preview?.includes("FLAG") || result.data?.result?.includes("FLAG")) && (
            <div style={flagSuccess}>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginBottom: 4, fontWeight: 700 }}>INTERNAL PROTOCOL SMUGGLED :: FLAG RECOVERED</div>
              <div style={{ fontSize: '1rem', color: '#fff', fontFamily: 'monospace' }}>
                {result.data.response_preview || result.data.result}
              </div>
            </div>
          )}
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 700, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(120,53,15,0.2)', borderBottom: '1px solid rgba(251,191,36,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 8 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: '#050508', border: '1px solid rgba(251,191,36,0.1)', borderRadius: 6, padding: '12px 15px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none' }
const btn = { flex: 2, padding: '12px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#d97706,#fbbf24)', color: '#000', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.86rem', fontWeight: 800 }
const btnSecondary = { flex: 1, padding: '12px', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(251,191,36,0.05)', color: '#fbbf24', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 600 }
const responseBox = { maxWidth: 700, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '18px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 350, overflow: 'auto' }
const flagSuccess = { marginTop: 15, padding: 15, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 6, textAlign: 'center' }
