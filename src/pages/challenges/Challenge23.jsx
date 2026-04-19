/*
 
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  'The "Archive Analytics" suite was built during the early days of NeoCorp\'s digital expansion.',
  'To maintain state across the distributed network with minimal latency, the developers chose to serialize entire operation objects directly into the traveler\'s session storage.',
  'Rumors among the engineering team suggest that some of these objects are... sensitive to their environment. They say the objects can be brought back to life, carrying commands from the void.',
  'Your mission: find the flag hidden on the server. The serialization format is old, but standard Node.js libraries of that era are known for their helpful, if dangerous, deserialization capabilities.'
]

export default function Challenge23({ apiBase }) {
  const [state, setState] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDebug = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${apiBase}/debug-session`)
      setState(res.data.example_base64)
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Failed to fetch debug data.' } })
    }
    setLoading(false)
  }

  const processState = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/process`, { state })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Failed to process state.' } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={23} title="The Ghost in the Serialization" vuln="Insecure Deserialization" difficulty="very hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={panel}>
          <div style={header}>ARCHIVE ANALYTICS - SESSION MANAGER</div>
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 15 }}>
              <button onClick={getDebug} style={btnSecondary}>Fetch Debug Session</button>
            </div>

            <label style={lbl}>SESSION STATE (BASE64 SERIALIZED)</label>
            <textarea 
              style={txtArea} 
              value={state} 
              onChange={e => setState(e.target.value)}
              placeholder="Paste serialized state here..."
            />

            <button onClick={processState} style={btnPrimary} disabled={loading || !state}>
              {loading ? 'Restoring Session...' : 'Restore Session'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)', marginTop: 20 }}>
             <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
              {result.ok ? '✓ SYSTEM RESPONSE' : '✗ SYSTEM RESPONSE'}
            </div>
            <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const panel = { background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }
const header = { background: '#21262d', padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#c9d1d9', letterSpacing: '0.05em' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#8b949e', marginBottom: 8, fontWeight: 600 }
const txtArea = { width: '100%', height: 120, background: '#010409', border: '1px solid #30363d', borderRadius: 8, padding: 12, color: '#79c0ff', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 15, outline: 'none' }
const btnPrimary = { width: '100%', padding: '12px', border: 'none', borderRadius: 8, background: '#238636', color: '#fff', fontWeight: 700, cursor: 'pointer' }
const btnSecondary = { padding: '8px 14px', border: '1px solid #30363d', borderRadius: 6, background: '#21262d', color: '#c9d1d9', fontSize: '0.75rem', cursor: 'pointer' }
const responseBox = { background: '#010409', border: '1px solid #30363d', borderRadius: 8, padding: 15 }
const pre = { margin: 0, fontSize: '0.8rem', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
