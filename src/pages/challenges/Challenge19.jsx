/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "They chose the fastest implementation they could think of: hand the template to `new Function()` and let JavaScript's template literals do the work. 'It's faster than a real template engine,' they wrote in the PR description.",
  "The code review missed that `new Function(body)` runs whatever body evaluates to — including property access, method calls, and references to `process`, `require`, and whatever else sits in the runtime. A marketing intern discovered this by accident when they typed `${1+1}` into the preview and it rendered `2`.",
  "Your mission: craft a template that reads the release flag from the server's runtime context.",
]

const SAMPLE = `Hi \${recipient_name},

Welcome to \${company}! Your account is ready as of \${year}.

— The NeoCorp Team`

export default function Challenge19({ apiBase }) {
  const [template, setTemplate] = useState(SAMPLE)
  const [recipient, setRecipient] = useState('Security Team')
  const [name, setName] = useState('Player')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const baseUrl = apiBase
      const res = await axios.post(`${baseUrl}/preview`, { template, recipient_name: name }, { withCredentials: true })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={19} title="Email Template Preview" vuln="Server-Side Template Injection" difficulty="hard" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP MARKETING — EMAIL PREVIEW</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>native JS templating · fast path</span>
        </div>

        <form onSubmit={submit} style={{ padding: '22px' }}>
          <label style={lbl}>RECIPIENT NAME</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={inp} />

          <label style={lbl}>TEMPLATE BODY</label>
          <textarea
            value={template}
            onChange={e => setTemplate(e.target.value)}
            style={textarea}
            spellCheck={false}
            maxLength={500}
          />
          <div style={{ color: '#475569', fontSize: '0.66rem', textAlign: 'right', marginTop: -10, marginBottom: 12 }}>
            {template.length}/500
          </div>
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Rendering…' : '{'> '} Preview Email'}</button>

          
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

const panel = { maxWidth: 660, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6, marginTop: 10 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '9px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', marginBottom: 10 }
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#e2e8f0', outline: 'none', marginBottom: 4, minHeight: 160, resize: 'vertical' }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
