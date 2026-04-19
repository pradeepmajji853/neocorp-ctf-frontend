/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "In the aftermath of previous template injection breaches, NeoCorp's 'Elite Security Division' has deployed the 'SafeTpl Fortified Kernel'. This engine is marketed as 'Mathematically Proven Inescapable'.",
  "The system uses a next-generation 'Null-Prototype' isolation layer. Even if an attacker can inject code, there is no prototype chain to traverse, no `process` to hijack, and no way out of the execution context.",
  "Your target is the 'SafeTpl Kernel' internal metadata. We believe the kernel's boot secrets are still accessible if you can correctly address the internal state map.",
  "Mission: Exploit the template literal interpolation `${...}` to read the system secrets. Prove that 'Mathematically Proven' is just another word for 'Not Tested Hard Enough'.",
]

export default function Challenge28({ apiBase }) {
  const [template, setTemplate] = useState('System v${SYSTEM.version} // UUID: ${SYSTEM.uuid}')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleExecute = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await axios.post(`${apiBase}/preview`, { template }, { withCredentials: true })
      setResult(res.data)
    } catch (err) {
      setResult({ output: null, error: err.response?.data?.error || err.message })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={28} title="The Fortified Kernel" vuln="Context-Isolated SSTI" difficulty="hard" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#00f2ff', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 800 }}>SAFETPL :: KERNEL_ISOLATION_v9.1</span>
          <span style={{ color: '#444', fontSize: '0.65rem', fontWeight: 700 }}>PROTOTYPE_CHAIN :: NULL</span>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 15 }}>
            Submit a string template for evaluation. The kernel supports standard ES6 template interpolation: <code>${'{expression}'}</code>
          </div>

          <form onSubmit={handleExecute}>
            <label style={lbl}>KERNEL_INPUT</label>
            <input 
              type="text" 
              value={template} 
              onChange={e => setTemplate(e.target.value)} 
              style={inp} 
              placeholder="System v${SYSTEM.version}"
              autoComplete="off"
            />
            
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button type="submit" style={btn} disabled={loading || !template}>
                {loading ? 'KERN_PROC...' : '>  EXECUTE_NODE'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.error ? 'rgba(239,68,68,0.2)' : 'rgba(0,242,255,0.2)' }}>
          <div style={{ color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.08em', marginBottom: 6 }}>KERNEL_RESPONSE</div>
          
          {result.error ? (
             <div style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'monospace', padding: 10, background: 'rgba(239,68,68,0.05)', borderRadius: 4, border: '1px solid rgba(239,68,68,0.2)' }}>
               {result.error}
             </div>
          ) : (
            <pre style={pre}>{result.output}</pre>
          )}

          {result.output?.includes("flag{") && (
            <div style={flagSuccess}>
              <div style={{ fontSize: '0.68rem', color: '#00f2ff', marginBottom: 4, fontWeight: 700 }}>CONTEXT BREAK DETECTED :: FLAG CAPTURED</div>
              <div style={{ fontSize: '1.1rem', color: '#fff', fontFamily: 'monospace' }}>
                {result.output.match(/flag\{[^\}]+\}/)?.[0] || result.output}
              </div>
            </div>
          )}
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: '700px', margin: '0 auto', background: '#0a0f1a', border: '1px solid rgba(0,242,255,0.15)', borderRadius: '12px', overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'rgba(0,242,255,0.05)', borderBottom: '1px solid rgba(0,242,255,0.1)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#4b5563', letterSpacing: '0.08em', marginBottom: 8 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: '#050508', border: '1px solid rgba(0,242,255,0.15)', borderRadius: '8px', padding: '14px 18px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', color: '#f8fafc', outline: 'none' }
const btn = { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'linear-gradient(135deg,#008aff,#00f2ff)', color: '#000', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', fontWeight: 800 }
const responseBox = { maxWidth: '700px', margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '20px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', color: '#00f2ff', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
const flagSuccess = { marginTop: 15, padding: 15, background: 'rgba(0,242,255,0.1)', border: '1px solid rgba(0,242,255,0.4)', borderRadius: '8px', textAlign: 'center' }
