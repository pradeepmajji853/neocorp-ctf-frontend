/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp Finance still accepts XML invoices from three legacy vendors who've refused to migrate to JSON since 2014. The XML parser hasn't been touched in five years.",
  "During a routine penetration test, a consultant noticed the parser resolved external entities — meaning an invoice could reference a file on the server's filesystem using <!ENTITY name SYSTEM 'file://path'>.",
  "A motivated attacker used this to pull the contents of a restricted finance file into what looked like a vendor invoice's 'notes' field. The security team didn't notice until the data showed up on a leak forum.",
  "Your mission: craft an invoice XML that reads a restricted file from the server and surfaces its contents in the parsed output.",
]

const SAMPLE = `<?xml version="1.0"?>
<invoice>
  <invoice_id>INV-0042</invoice_id>
  <vendor>Acme Corp</vendor>
  <amount>1299.00</amount>
  <notes>Standard vendor invoice.</notes>
</invoice>`

export default function Challenge15() {
  const [xml, setXml] = useState(SAMPLE)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const baseUrl = `/api${window.location.pathname}`
      const res = await axios.post(`${baseUrl}/import`, { xml }, { withCredentials: true })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={15} title="Invoice Import" vuln="XXE" difficulty="medium" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP FINANCE — INVOICE IMPORT</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>legacy XML parser · 2014-vintage</span>
        </div>

        <form onSubmit={submit} style={{ padding: '22px' }}>
          <label style={lbl}>INVOICE XML PAYLOAD</label>
          <textarea
            value={xml}
            onChange={e => setXml(e.target.value)}
            style={textarea}
            spellCheck={false}
          />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Parsing…' : '{'> '} Import Invoice'}</button>

          
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
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#e2e8f0', outline: 'none', marginBottom: 14, minHeight: 180, resize: 'vertical' }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
