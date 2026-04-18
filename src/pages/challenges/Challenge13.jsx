/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "At 09:22 on a Thursday, a CI bot at NeoCorp pushed a release to production. Part of the deploy script gzipped the working directory into a timestamped archive for disaster recovery — then forgot to move it out of the web root.",
  "The archive stayed publicly reachable for eleven days. Long enough for a threat actor scanning for common backup paths to find it, download it, and walk away with the production .env.",
  "The internal diagnostics dashboard still logs deploy metadata. Including, inadvertently, the exact timestamp of the archive that was forgotten.",
  "Your mission: find the archive. The filename pattern is a common one — you've seen it before.",
]

export default function Challenge13() {
  const [custom, setCustom] = useState('')

  const baseUrl = `/api${window.location.pathname}`
  const ENDPOINTS = [
    `${baseUrl}/info`,
    `${baseUrl}/backup.zip`,
    `${baseUrl}/backup-2025-11-13.zip`,
    `${baseUrl}/backup-2025-11-14.zip`,
  ]
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = async (url) => {
    setLoading(true); setResult(null)
    try {
      const res = await axios.get(url, { withCredentials: true })
      setResult({ ok: true, url, data: res.data })
    } catch (err) {
      setResult({ ok: false, url, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={13} title="Forgotten Backup" vuln="Sensitive Data Exposure" difficulty="easy" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP WEBROOT</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>internal dashboard probe</span>
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{ color: '#475569', fontSize: '0.72rem', marginBottom: 10 }}>Known endpoints:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {ENDPOINTS.map((u) => (
              <button key={u} onClick={() => fetch(u)} disabled={loading} style={pathBtn}>
                GET {u}
              </button>
            ))}
          </div>

          <label style={lbl}>TRY A CUSTOM PATH</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...inp, marginBottom: 0 }} type="text" value={custom} onChange={e => setCustom(e.target.value)} placeholder={`${baseUrl}/...`} autoComplete="off" />
            <button onClick={() => custom && fetch(custom)} disabled={loading || !custom} style={btn}>Fetch</button>
          </div>
        </div>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
            {result.url}
          </div>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 600, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', marginBottom: 12 }
const btn = { padding: '10px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap' }
const pathBtn = { textAlign: 'left', padding: '8px 12px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#e2e8f0', borderRadius: 6, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem' }
const responseBox = { maxWidth: 600, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.76rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
