/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The SSO team added a 'post-login return URL' feature so employees could deep-link into dashboards. The feature went out with a single validation rule: 'the URL must contain a trusted domain string'.",
  "Six months later, an engineering manager clicked a link in a Teams DM that looked exactly like the SSO redirect page. By the time the URL bar updated, their session cookie was already on an attacker's server.",
  "The post-mortem pointed at the validation logic — .includes() on the domain string. A URL like //evil.com?trusted=neocorp.io passed. So did http://neocorp.io.evil.com.",
  "Your mission: craft a URL that the validator accepts but actually routes to an attacker-controlled host.",
]

export default function Challenge12({ apiBase }) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const baseUrl = apiBase
      const res = await axios.get(`${baseUrl}/goto`, { params: { next: url }, withCredentials: true, maxRedirects: 0, validateStatus: () => true })
      setResult({ ok: res.status < 400, data: res.data, status: res.status })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={12} title="Phishing Gateway" vuln="Open Redirect" difficulty="easy" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP SSO — RETURN URL</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>trusted: neocorp.io · cybermindspace.io</span>
        </div>
        <form onSubmit={submit} style={{ padding: '22px' }}>
          <label style={lbl}>REDIRECT TARGET (?next=)</label>
          <input style={inp} type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="e.g. /dashboard or https://neocorp.io/home" autoComplete="off" />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Validating…' : '>  Follow Redirect'}</button>
        </form>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
            SERVER RESPONSE {result.status && `(${result.status})`}
          </div>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 560, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', marginBottom: 16 }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const responseBox = { maxWidth: 560, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.76rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
