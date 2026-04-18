/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "An engineer on the platform team wrote a twelve-line `deepMerge` helper so the settings API could accept partial updates. They copy-pasted it from a Stack Overflow answer from 2016. No filter for `__proto__`. No `Object.create(null)`. It merged everything.",
  "Six weeks later, a security consultant pasted `{\"__proto__\": {\"isAdmin\": true}}` into the preferences endpoint and watched every subsequent request be treated as admin. The `isAdmin` check elsewhere in the app did `if (user.isAdmin)` on a plain object — and plain objects inherit from Object.prototype.",
  "The exploit didn't need privileges. It didn't touch the database. It mutated the runtime itself. The fix was three characters: `hasOwn`.",
  "Your mission: pollute the prototype so the admin panel thinks every empty object is a system admin.",
]

const SAMPLE = `{
  "theme": "light",
  "notifications": { "email": false }
}`

export default function Challenge18({ apiBase }) {
  const [body, setBody] = useState(SAMPLE)
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

  const submitMerge = async (e) => {
    e.preventDefault()
    let parsed
    try { parsed = JSON.parse(body) }
    catch (err) {
      setResult({ ok: false, data: { message: 'Invalid JSON: ' + err.message } }); return
    }
    const baseUrl = apiBase
    call('put', '/preferences', parsed)
  }

  return (
    <ChallengeShell id={18} title="Preferences Merge" vuln="Prototype Pollution" difficulty="hard" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP SETTINGS — DEEP MERGE</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>recursive, unfiltered</span>
        </div>

        <form onSubmit={submitMerge} style={{ padding: '22px' }}>
          <label style={lbl}>PREFERENCES PAYLOAD (JSON)</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            style={textarea}
            spellCheck={false}
          />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Merging…' : '{'> '} PUT /preferences'}</button>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button type="button" onClick={() => call('get', '/admin-panel')} disabled={loading} style={btnSecondary}>
              Test /admin-panel
            </button>
            <button type="button" onClick={() => call('post', '/cleanup', {})} disabled={loading} style={btnGhost}>
              Cleanup
            </button>
          </div>

            
        </form>
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
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#e2e8f0', outline: 'none', marginBottom: 14, minHeight: 160, resize: 'vertical' }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const btnSecondary = { flex: 1, padding: '10px', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(59,130,246,0.08)', color: '#93c5fd', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.8rem', fontWeight: 600 }
const btnGhost = { padding: '10px 14px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.8rem' }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
