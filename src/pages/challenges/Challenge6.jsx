/*
 
 * Students must discover path traversal themselves. No presets provided.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "On Day 6, the attacker accessed files they had no business reading — server configurations, private keys, and an internal memo detailing critical vulnerabilities in NeoCorp's payment processor.",
  "A file archive endpoint was meant to serve quarterly reports by filename. The endpoint accepted a file parameter and used it to construct the file path on disk — without normalizing or restricting the path.",
  "The only constraint in place was on file type. The attacker bypassed it in seconds. Shortly after, files from outside the web root were streaming to an external server.",
  "You have access to the same archive endpoint. Figure out how it constructs the file path and whether it can be escaped. Look for files that shouldn't be accessible from here.",
]

export default function Challenge6() {
  const [filename, setFilename] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRead = async (e) => {
    e.preventDefault(); setLoading(true); setResult(null)
    try {
      const res = await axios.get('/api/challenge6/read', { params: { file: filename }, responseType: 'text' })
      setResult({ ok: true, content: res.data })
    } catch (err) {
      setResult({ ok: false, content: JSON.stringify(err.response?.data, null, 2) })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={6} title="Internal File Archive" vuln="Directory Traversal" difficulty="medium" backstory={BACKSTORY}>
      <div style={{ maxWidth: 600 }}>
        <div style={sysLabel}>NEOCORP REPORTS ARCHIVE</div>
        <div style={{ color: '#334155', fontSize: '0.75rem', lineHeight: 1.7, marginBottom: 20 }}>
          Retrieve internal documents by filename. Supported format: <code style={code}>filename.txt</code>
        </div>

        <form onSubmit={handleRead} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            style={{ ...inp, flex: 1 }}
            type="text"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            placeholder="e.g. report.txt"
          />
          <button type="submit" style={btnOutline} disabled={loading || !filename}>
            {loading ? '...' : '>  Retrieve File'}
          </button>
        </form>

        {result && (
          <div style={{
            background: result.ok ? '#090e1e' : 'rgba(248,113,113,0.04)',
            border: `1px solid ${result.ok ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.18)'}`,
            borderRadius: 8, padding: 16,
          }}>
            <div style={{ color: result.ok ? '#34d399' : '#f87171', fontSize: '0.68rem', marginBottom: 8 }}>
              {result.ok ? '✓ FILE RETRIEVED' : '✗ ERROR'}
            </div>
            <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: result.ok ? '#cbd5e1' : '#f87171', whiteSpace: 'pre-wrap' }}>
              {result.content}
            </pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
const btnOutline = { padding: '10px 18px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
const code = { color: '#38bdf8', background: 'rgba(56,189,248,0.08)', padding: '1px 5px', borderRadius: 3, fontSize: '0.9em' }
