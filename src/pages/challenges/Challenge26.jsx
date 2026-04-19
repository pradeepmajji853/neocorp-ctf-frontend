/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The 'Chimera' project was NeoCorp's attempt at a self-optimizing cloud infrastructure. At its heart was a 'Deep Merge' engine that could consolidate thousands of JSON configuration fragments in milliseconds.",
  "The developers knew about Prototype Pollution. They added a check for `'__proto__'` and considered the problem solved. They even boasted about it in their internal newsletter: 'Impossible to pollute.'",
  "But JavaScript's inheritance tree is deep. There are other ways to reach the prototype of all objects. If an attacker can inject a property into the base `Object.prototype`, they can influence almost every object in the system.",
  "Your mission: Find a way to pollute the global prototype with the property `rce_trigger` set to `exec_payload_7721`. The system status monitor will reveal the flag if it detects the compromise.",
]

export default function Challenge26({ apiBase }) {
  const [jsonInput, setJsonInput] = useState('{\n  "mode": "performance",\n  "performance": {\n    "aggressive": true\n  }\n}')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const call = async (method, path, data = null) => {
    setLoading(true)
    setResult(null)
    try {
      let parsedConfig = null
      if (data) {
        try {
          parsedConfig = JSON.parse(data)
        } catch (e) {
          throw new Error("Invalid JSON input.")
        }
      }

      const res = await axios({
        method,
        url: `${apiBase}${path}`,
        data: parsedConfig ? { config: parsedConfig } : null,
        withCredentials: true
      })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  const handleOptimize = (e) => {
    e.preventDefault()
    call('post', '/optimize', jsonInput)
  }

  return (
    <ChallengeShell id={26} title="The Chimera's Breath" vuln="Prototype Pollution to RCE" difficulty="extreme" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#f87171', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>CHIMERA :: DEEP MERGE ENGINE v4.0</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>__proto__ blocked // verified safe</span>
        </div>

        <div style={{ padding: 22 }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 15 }}>
            Submit a configuration fragment to the optimization kernel. The kernel merges it into the system base config using its proprietary deep-merge logic.
          </div>

          <form onSubmit={handleOptimize}>
            <label style={lbl}>USER CONFIGURATION (JSON)</label>
            <textarea 
              value={jsonInput} 
              onChange={e => setJsonInput(e.target.value)} 
              style={textarea} 
              rows={8}
              spellCheck="false"
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button type="submit" style={btn} disabled={loading}>
                {loading ? 'Merging…' : '>  POST /optimize'}
              </button>
              <button type="button" onClick={() => call('get', '/status')} style={btnSecondary} disabled={loading}>
                GET /status
              </button>
              <button type="button" onClick={() => call('post', '/reset')} style={btnGhost} disabled={loading}>
                Reset Prototype
              </button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 6 }}>SYSTEM_KERNEL_RESPONSE</div>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          
          {result.data?.system_status?.flag && (
            <div style={flagSuccess}>
              <div style={{ fontSize: '0.7rem', color: '#34d399', marginBottom: 4, fontWeight: 700 }}>EXPLOIT SUCCESSFUL :: ROOT PROTOTYPE BREACHED</div>
              <div style={{ fontSize: '1rem', color: '#fff', fontFamily: 'monospace' }}>{result.data.system_status.flag}</div>
            </div>
          )}
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 700, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(153,27,27,0.15)', borderBottom: '1px solid rgba(248,113,113,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 8 }
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: '#050508', border: '1px solid rgba(248,113,113,0.1)', borderRadius: 6, padding: '15px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', resize: 'vertical' }
const btn = { flex: 2, padding: '12px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.86rem', fontWeight: 700 }
const btnSecondary = { flex: 1, padding: '12px', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(239,68,68,0.05)', color: '#fca5a5', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 600 }
const btnGhost = { padding: '12px 20px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem' }
const responseBox = { maxWidth: 700, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '18px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 350, overflow: 'auto' }
const flagSuccess = { marginTop: 15, padding: 15, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, textAlign: 'center' }
