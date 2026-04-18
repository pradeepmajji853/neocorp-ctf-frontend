/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The compliance team at NeoCorp audited every INSERT in the codebase. Every one of them used bound parameters. They wrote a memo: 'SQL injection is no longer possible in this application.' Leadership signed off. A plaque was ordered.",
  "Three months later, the audit-log viewer started returning rows from a table it was never supposed to touch. The viewer query looked like this: `SELECT ... WHERE actor = '<name>'` — and the `<name>` came from the account table, which was written safely with bound parameters.",
  "The catch: whatever got stored, got trusted. A malicious display_name inserted with perfect safety became a raw SQL fragment the moment the audit viewer read it back and dropped it into a new query. Second-order injection.",
  "Your mission: register an account, then view your audit log. The ledger table holds a secret. Bring it out through the query the viewer builds.",
]

export default function Challenge20({ apiBase }) {
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const call = async (method, url, data) => {
    setLoading(true); setResult(null)
    try {
      const baseUrl = apiBase
      const res = await axios({ method, url: `${baseUrl}${url}`, data, withCredentials: true })
      setResult({ ok: true, url: `${baseUrl}${url}`, data: res.data })
    } catch (err) {
      setResult({ ok: false, url, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  const register = (e) => {
    e.preventDefault()
    if (!name) return
    call('post', '/register-account', { display_name: name })
  }

  return (
    <ChallengeShell id={20} title="Audit Log Viewer" vuln="Second-Order SQL Injection" difficulty="medium" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP COMPLIANCE — AUDIT LOG</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>all INSERTs bound · memo attached</span>
        </div>

        <form onSubmit={register} style={{ padding: '22px 22px 10px' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: 10 }}>STEP 1 — Register an account</div>
          <label style={lbl}>DISPLAY NAME (stored via bound INSERT)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="e.g. operative_7" autoComplete="off" />
          <button type="submit" style={btn} disabled={loading || !name}>{loading ? 'Registering…' : '{'> '} POST /register-account'}</button>
        </form>

        <div style={{ padding: '0 22px 22px' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', margin: '16px 0 8px' }}>STEP 2 — Fetch your audit log (built from your stored display_name)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => call('get', '/my-audit')} disabled={loading} style={btnSecondary}>GET /my-audit</button>
            <button onClick={() => call('get', '/schema')} disabled={loading} style={btnGhost}>View Schema</button>
            <button onClick={() => call('post', '/reset', {})} disabled={loading} style={btnGhost}>Reset</button>
          </div>

          
        </div>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          {result.url && <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 6 }}>{result.url}</div>}
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 660, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.84rem', color: '#e2e8f0', outline: 'none', marginBottom: 12 }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.86rem', fontWeight: 700 }
const btnSecondary = { padding: '10px 14px', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(59,130,246,0.08)', color: '#93c5fd', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 600 }
const btnGhost = { padding: '10px 14px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem' }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflow: 'auto' }
