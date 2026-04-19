/*

 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's ops team built a 'signed-action' vault — a control plane where privileged commands must carry a signature. The scheme looked simple on the whiteboard: signature = SHA256(SECRET || data). Anyone who holds the secret can sign. Anyone can verify by asking the vault.",
  "Because the sign endpoint was going to be used by non-admin operators, they added a keyword filter: 'release_flag', 'clearance', 'omega' — these tokens are banned from the input. The idea was that even a rogue operator could never convince the vault to sign a privileged request.",
  "What the engineers forgot is that SHA-256 is a Merkle-Damgard hash. Its internal state after processing one message is not secret — it's the output. Given signature(SECRET || data) and len(SECRET), an attacker can continue the hash from that state and produce signature(SECRET || data || glue || extra) without ever seeing SECRET.",
  "Worse still, the execute endpoint parses the signed blob as key=val pairs with last-wins semantics. Whatever the attacker appends after the glue padding overrides whatever was signed before.",
  "Your mission: read the vault's /info, ask /sign to co-sign a benign operator token, then use length extension to forge a signature for a blob that decodes to action=release_flag with clearance=omega. Submit the forgery to /execute.",
]

export default function Challenge21({ apiBase }) {
  const [info, setInfo] = useState(null)
  const [signData, setSignData] = useState('user=guest&section=home')
  const [signed, setSigned] = useState(null)
  const [forgedHex, setForgedHex] = useState('')
  const [forgedSig, setForgedSig] = useState('')
  const [execResult, setExecResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${apiBase}/info`).then(r => setInfo(r.data)).catch(() => {})
  }, [apiBase])

  const doSign = async (e) => {
    e.preventDefault(); setLoading(true); setSigned(null)
    try {
      const r = await axios.post(`${apiBase}/sign`, { data: signData })
      setSigned({ ok: true, data: r.data })
    } catch (err) {
      setSigned({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  const doExecute = async (e) => {
    e.preventDefault(); setLoading(true); setExecResult(null)
    try {
      const r = await axios.post(`${apiBase}/execute`, {
        data_hex: forgedHex.trim(),
        signature: forgedSig.trim(),
      })
      setExecResult({ ok: true, data: r.data })
    } catch (err) {
      setExecResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={21} title="Signature Vault" vuln="Hash Length Extension" difficulty="extreme" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#f472b6', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP VAULT — SIGNED ACTIONS</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>Merkle-Damgard · keyword filtered</span>
        </div>

        {info && (
          <div style={infoBox}>
            <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 6 }}>GET /info</div>
            <pre style={pre}>{JSON.stringify(info, null, 2)}</pre>
          </div>
        )}

        <form onSubmit={doSign} style={{ padding: '20px 22px 10px', borderTop: '1px solid rgba(244,114,182,0.08)' }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginBottom: 10 }}>STEP 1 — Ask the vault to co-sign a benign operator token</div>
          <label style={lbl}>DATA (printable ASCII; reserved tokens rejected)</label>
          <input type="text" value={signData} onChange={e => setSignData(e.target.value)} style={inp} autoComplete="off" />
          <button type="submit" style={btn} disabled={loading || !signData}>{loading ? 'Signing…' : '>  POST /sign'}</button>
          {signed && (
            <div style={{ ...resultSm, borderColor: signed.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
              <pre style={preSm}>{JSON.stringify(signed.data, null, 2)}</pre>
            </div>
          )}
        </form>

        <form onSubmit={doExecute} style={{ padding: '10px 22px 22px', borderTop: '1px solid rgba(244,114,182,0.08)', marginTop: 14 }}>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 10, marginBottom: 10 }}>STEP 2 — Submit the forgery (use a length-extension tool offline)</div>
          <label style={lbl}>FORGED data_hex</label>
          <textarea value={forgedHex} onChange={e => setForgedHex(e.target.value)} style={textarea} spellCheck={false} placeholder="paste hex from your length-extension tool" />
          <label style={lbl}>FORGED signature (64 hex)</label>
          <input type="text" value={forgedSig} onChange={e => setForgedSig(e.target.value)} style={inp} placeholder="64-char sha256 hex" autoComplete="off" />
          <button type="submit" style={btn} disabled={loading || !forgedHex || !forgedSig}>{loading ? 'Executing…' : '>  POST /execute'}</button>
        </form>
      </div>

      {execResult && (
        <div style={{ ...responseBox, borderColor: execResult.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <pre style={pre}>{JSON.stringify(execResult.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 660, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(244,114,182,0.15)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(190,24,93,0.18)', borderBottom: '1px solid rgba(244,114,182,0.12)' }
const infoBox = { padding: '14px 22px', background: 'rgba(30,58,138,0.06)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6, marginTop: 10 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,114,182,0.18)', borderRadius: 6, padding: '9px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', marginBottom: 10 }
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,114,182,0.18)', borderRadius: 6, padding: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#e2e8f0', outline: 'none', marginBottom: 12, minHeight: 96, resize: 'vertical' }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#ec4899,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.86rem', fontWeight: 700 }
const resultSm = { marginTop: 12, background: '#060a14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '10px 12px' }
const preSm = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflow: 'auto' }
