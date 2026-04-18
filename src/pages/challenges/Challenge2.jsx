/*
 
 * Students must find the flag via DevTools → Network tab. NOT shown on screen.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's internal document archive went live six months ago — a makeshift search interface bolted onto their existing file system without any security review.",
  "The developer who built it passed user input directly into the HTML response, assuming it would only ever be displayed as plain text. Analysis of the breach timeline places this as the entry point for the second stage of the attack.",
  "Your task: probe the search endpoint. Understand how the server handles what you send it. There may be more to the server's response than what is rendered on the page.",
]

export default function Challenge2() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.get('/api/challenge2/results', { params: { q: query } })
      setResults(res.data)
      setSearched(true)
    } catch { setResults(null) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={2} title="Document Archive" vuln="Reflected XSS" difficulty="easy" backstory={BACKSTORY}>
      <div style={{ maxWidth: 640 }}>
        <div style={sysLabel}>NEOCORP — INTERNAL DOCUMENT SEARCH</div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input style={{ ...inp, flex: 1 }} type="text" value={query}
            onChange={e => setQuery(e.target.value)} placeholder="Search documents..." />
          <button type="submit" style={btnOutline} disabled={loading}>{loading ? '...' : '{'> '} Search'}</button>
        </form>

        {results !== null && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 12 }}>
              {/* INTENTIONAL: raw query reflected back — simulates server behavior */}
              Search results for: <span style={{ color: '#38bdf8' }}>{results.query || '(empty)'}</span>
            </div>

            {results.results?.length > 0 ? results.results.map(r => (
              <div key={r.id} style={card}>
                <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem' }}>{r.title}</div>
                <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: 4 }}>
                  {r.type} · <span style={{ color: r.classification === 'confidential' || r.classification === 'restricted' ? '#f87171' : '#475569' }}>{r.classification}</span>
                </div>
              </div>
            )) : (
              <div style={{ color: '#334155', fontSize: '0.85rem' }}>No documents found.</div>
            )}
          </div>
        )}

        {/* Subtle reminder — no spoilers */}
        {searched && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(59,130,246,0.08)', borderRadius: 6 }}>
            <div style={{ color: '#334155', fontSize: '0.7rem', fontFamily: "'JetBrains Mono',monospace" }}>
              Request made to /api/challenge2/results?q={encodeURIComponent(query)} — inspect the full HTTP exchange in your browser.
            </div>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 14, textTransform: 'uppercase' }
const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
const btnOutline = { padding: '10px 18px', border: '1px solid rgba(56,189,248,0.35)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
const card = { padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(59,130,246,0.08)', borderRadius: 6, marginBottom: 8 }
