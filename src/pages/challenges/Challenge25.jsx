import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  'The Architect\'s Ledger is the master map of NeoCorp\'s digital empire. It is the heart of their infrastructure management, shielding its schema from prying eyes.',
  'It is powered by a modern GraphQL API, which the developers claim is "secure by design" because it only answers the questions it was taught.',
  'Yet, the ledger\'s very efficiency—its ability to answer a thousand questions in a single breath—might be its downfall.',
  'Your mission: find the System PIN to unlock the infrastructure statistics. The API has a strict rate limit of one request per second, making standard brute-force impossible. But maybe you can ask many questions at once.'
]

export default function Challenge25({ apiBase }) {
  const [query, setQuery] = useState('{\n  version\n  infrastructureManifest {\n    nodeName\n    status\n  }\n}')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchHint = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${apiBase}/v1/schema-fragment`)
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'Failed to fetch hint.' } })
    }
    setLoading(false)
  }

  const runQuery = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/graphql`, { query })
      setResult({ ok: true, data: res.data })
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: 'GraphQL Query Failed.' } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={25} title="The Architect's Ledger" vuln="GraphQL Batching" difficulty="very hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={panel}>
          <div style={header}>ARCHITECT\'S LEDGER - GRAPHQL INTERFACE</div>
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 15, display: 'flex', gap: 10 }}>
              <button onClick={fetchHint} style={btnSecondary}>Inspect Schema Fragment</button>
            </div>

            <label style={lbl}>GRAPHQL QUERY</label>
            <textarea 
              style={txtArea} 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="{\n  version\n}"
            />

            <button onClick={runQuery} style={btnPrimary} disabled={loading || !query}>
              {loading ? 'Executing Query...' : 'Execute GraphQL Query'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(59,130,246,0.3)' : 'rgba(248,113,113,0.3)', marginTop: 20 }}>
             <div style={{ color: result.ok ? '#60a5fa' : '#f87171', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
              {result.ok ? '✓ GRAPHQL RESPONSE' : '✗ API ERROR'}
            </div>
            <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const panel = { background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }
const header = { background: '#161b22', padding: '14px 22px', fontSize: '0.75rem', fontWeight: 700, color: '#8b949e', letterSpacing: '0.05em' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#8b949e', marginBottom: 8, fontWeight: 600 }
const txtArea = { width: '100%', height: 200, background: '#010409', border: '1px solid #30363d', borderRadius: 8, padding: 15, color: '#d2a8ff', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', marginBottom: 15, outline: 'none', resize: 'vertical' }
const btnPrimary = { width: '100%', padding: '12px', border: 'none', borderRadius: 8, background: '#388bfd', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }
const btnSecondary = { padding: '8px 14px', border: '1px solid #30363d', borderRadius: 6, background: '#21262d', color: '#c9d1d9', fontSize: '0.75rem', cursor: 'pointer' }
const responseBox = { background: '#010409', border: '1px solid #30363d', borderRadius: 8, padding: 15 }
const pre = { margin: 0, fontSize: '0.8rem', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
