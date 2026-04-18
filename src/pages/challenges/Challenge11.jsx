/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's SRE team built a quick internal tool to let support staff ping customer VPNs during outages. It went into production on a Friday night, two weeks before the breach.",
  "The tool takes a hostname, runs a shell command on the NeoCorp diagnostics VM, and returns the output. 'Just ping — what could go wrong?' said the intern.",
  "During the incident, the attacker found the tool on an internal wiki, realized the hostname input flowed straight into bash, and used it to enumerate the filesystem from a semi-privileged service account.",
  "Your mission: recreate that move. Find what's on the box besides the expected ping output.",
]

export default function Challenge11({ apiBase }) {
  const [host, setHost] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const runPing = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const baseUrl = apiBase
      const res = await axios.post(`${baseUrl}/ping`, { host }, { withCredentials: true })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={11} title="Network Diagnostics" vuln="Command Injection" difficulty="easy" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP NETDIAG v2.1</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>internal tool — support use</span>
        </div>
        <form onSubmit={runPing} style={{ padding: '22px 22px 14px' }}>
          <label style={lbl}>HOST / IP</label>
          <input style={inp} type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="e.g. google.com" autoComplete="off" />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Pinging…' : '{'> '} Run Ping'}</button>
        </form>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
            {result.ok ? '✓ COMMAND EXECUTED' : '✗ ERROR'}
          </div>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 520, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', marginBottom: 16 }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const responseBox = { maxWidth: 520, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.76rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
