/*
 
 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "The growth team launched a referral drive with three promo codes. The contract with finance was clear: each player may redeem each code exactly once, no exceptions.",
  "The redemption endpoint enforced that rule — sort of. It read the 'already redeemed' set, paused 120ms to 'validate against the partner API', then incremented credits. Sequential requests obeyed the rule. Concurrent requests were never tested.",
  "Within 48 hours of launch, one account had redeemed LAUNCH100 eleven times. They'd sent eleven HTTP requests in a tight loop — all eleven passed the check before any of them mutated state. Finance refunded, engineering added a row-level lock, nobody got fired.",
  "Your mission: reproduce the race. Redeem the same code enough times to push your credit balance past 1000.",
]

const CODES = ['FIRSTTIME25', 'WELCOME50', 'LAUNCH100']

export default function Challenge17() {
  const [result, setResult] = useState(null)
  const [code, setCode] = useState('LAUNCH100')
  const [parallel, setParallel] = useState(15)
  const [balance, setBalance] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const loadBalance = async () => {
    try {
      const baseUrl = `/api${window.location.pathname}`
      const res = await axios.get(`${baseUrl}/balance`, { withCredentials: true })
      setBalance(res.data)
    } catch (err) { /* ignore */ }
  }

  useEffect(() => { loadBalance() }, [])

  const reset = async () => {
    const baseUrl = `/api${window.location.pathname}`
    await axios.post(`${baseUrl}/reset`, {}, { withCredentials: true })
    setResults([])
    loadBalance()
  }

  const fireSingle = async () => {
    setLoading(true); setResults([])
    try {
      const baseUrl = `/api${window.location.pathname}`
      const res = await axios.post(`${baseUrl}/redeem`, { code }, { withCredentials: true })
      setResults([{ ok: true, data: res.data }])
    } catch (err) {
      setResults([{ ok: false, data: err.response?.data || { message: err.message } }])
    }
    await loadBalance()
    setLoading(false)
  }

  const fireParallel = async () => {
    setLoading(true); setResults([])
    const baseUrl = `/api${window.location.pathname}`
    const promises = Array.from({ length: parallel }, () =>
      axios.post(`${baseUrl}/redeem`, { code }, { withCredentials: true })
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
              {balance.credits} credits · {balance.redemption_count} redemptions
            </div>
            {balance.redeemed_promos?.length > 0 && (
              <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: 4 }}>
                already used: {balance.redeemed_promos.join(', ')}
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '22px' }}>
          <label style={lbl}>PROMO CODE</label>
          <select value={code} onChange={e => setCode(e.target.value)} style={inp}>
            {CODES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={lbl}>PARALLEL REQUEST COUNT</label>
          <input type="number" min="1" max="50" value={parallel} onChange={e => setParallel(parseInt(e.target.value || '1'))} style={inp} />

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={fireSingle} disabled={loading} style={btnSecondary}>Redeem Once</button>
            <button onClick={fireParallel} disabled={loading} style={btn}>Fire {parallel} in Parallel</button>
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

const panel = { maxWidth: 620, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const profileBox = { padding: '14px 22px', borderBottom: '1px solid rgba(59,130,246,0.08)', background: 'rgba(30,58,138,0.08)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6, marginTop: 10 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '9px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none' }
const btn = { flex: 1, padding: '10px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 700 }
const btnSecondary = { padding: '10px 14px', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, cursor: 'pointer', background: 'rgba(59,130,246,0.08)', color: '#93c5fd', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', fontWeight: 600 }
const btnGhost = { padding: '10px 14px', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem' }
const responseBox = { maxWidth: 620, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(52,211,153,0.12)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflow: 'auto' }
