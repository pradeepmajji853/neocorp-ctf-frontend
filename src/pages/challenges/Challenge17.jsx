/*
 
 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The growth team launched a referral drive. The contract with finance was clear: each player may redeem each code exactly once, no exceptions.",
  "The redemption endpoint enforced that rule — sort of. It read the 'already redeemed' set, paused to validate, then incremented credits. Sequential requests obeyed the rule. Concurrent requests were never tested.",
  "Within 48 hours of launch, one account had redeemed a promo code eleven times. They'd sent eleven HTTP requests in a tight loop — all eleven passed the 'already redeemed' check before any of them mutated state.",
  "Your mission: reproduce the race. Find a valid promo code and redeem it enough times concurrently to push your credit balance past 1000.",
]

export default function Challenge17({ apiBase }) {
  const [code, setCode] = useState('')
  const [balance, setBalance] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const baseUrl = apiBase

  const loadBalance = async () => {
    try {
      const res = await axios.get(`${baseUrl}/balance`, { withCredentials: true })
      setBalance(res.data)
    } catch { /* ignore */ }
  }

  useEffect(() => { loadBalance() }, [apiBase])

  const reset = async () => {
    await axios.post(`${baseUrl}/reset`, {}, { withCredentials: true })
    setResults([])
    loadBalance()
  }

  const fireSingle = async () => {
    if (!code.trim()) return
    setLoading(true); setResults([])
    try {
      const res = await axios.post(`${baseUrl}/redeem`, { code: code.trim() }, { withCredentials: true })
      setResults([{ ok: true, data: res.data }])
    } catch (err) {
      setResults([{ ok: false, data: err.response?.data || { message: err.message } }])
    }
    await loadBalance()
    setLoading(false)
  }

  // Student must figure out how many parallel requests to send
  const fireParallel = async () => {
    if (!code.trim()) return
    setLoading(true); setResults([])
    // Send 15 concurrent requests — student knows they need to overwhelm the TOCTOU window
    const promises = Array.from({ length: 15 }, () =>
      axios.post(`${baseUrl}/redeem`, { code: code.trim() }, { withCredentials: true })
        .then(r => ({ ok: true, data: r.data }))
        .catch(e => ({ ok: false, data: e.response?.data || { message: e.message } }))
    )
    const r = await Promise.all(promises)
    setResults(r)
    await loadBalance()
    setLoading(false)
  }

  return (
    <ChallengeShell id={17} title="Promo Code Redemption" vuln="Race Condition" difficulty="hard" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP STORE — PROMO REDEMPTION</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>each code · once per player</span>
        </div>

        {balance && (
          <div style={profileBox}>
            <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em' }}>CURRENT BALANCE</div>
            <div style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>
              {balance.credits} credits
            </div>
          </div>
        )}

        <div style={{ padding: '22px' }}>
          <label style={lbl}>PROMO CODE</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={inp}
            placeholder="Enter promo code..."
            autoComplete="off"
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={fireSingle} disabled={loading || !code.trim()} style={btnSecondary}>
              Redeem Once
            </button>
            <button onClick={fireParallel} disabled={loading || !code.trim()} style={btn}>
              Redeem (Parallel)
            </button>
            <button onClick={reset} disabled={loading} style={btnGhost}>Reset</button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div style={responseBox}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 8 }}>
            {results.length} response(s) · {results.filter(r => r.ok).length} success · {results.filter(r => !r.ok).length} failed
          </div>
          <pre style={pre}>{JSON.stringify(results.map(r => r.data), null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 540, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const profileBox = { padding: '14px 22px', borderBottom: '1px solid rgba(59,130,246,0.08)', background: 'rgba(30,58,138,0.08)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6, marginTop: 10 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '9px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none' }
const btn = { flex: 1, padding: '10px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 700 }
const btnSecondary = { padding: '10px 14px', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(59,130,246,0.08)', color: '#93c5fd', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 600 }
const btnGhost = { padding: '10px 14px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem' }
const responseBox = { maxWidth: 540, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(52,211,153,0.12)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflow: 'auto' }
