/*
 
 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's player-profile service was one of three APIs shipped on the same deadline. The UI exposed four fields: display name, email, bio, theme. The backend team decided 'the UI sends only what it sends' and wrote a one-line update handler.",
  "That one line was `{ ...current, ...req.body }`. Whatever the client sent, the server applied. The UI never rendered a role picker, so the backend never filtered one out.",
  "A curious beta tester opened DevTools, intercepted the PUT request, and added `\"role\": \"admin\"`. Three minutes later, they had the internal admin panel open in a second tab. The incident report used the phrase 'trusted the UI, not the payload'.",
  "Your mission: update your profile through the API with fields the UI never shows you. Elevate role, kyc, or credits.",
]

const DEFAULT_BODY = `{
  "display_name": "my-new-name",
  "bio": "I'm just editing my profile!"
}`

export default function Challenge16({ apiBase }) {
  const [body, setBody] = useState(DEFAULT_BODY)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseUrl = apiBase
        const res = await axios.get(`${baseUrl}/profile`, { withCredentials: true })
        setProfile(res.data.profile)
      } catch (err) { /* ignore */ }
      setLoadingProfile(false)
    }
    fetchProfile()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    let parsed
    try { parsed = JSON.parse(body) }
    catch (err) {
      setResult({ ok: false, data: { message: 'Invalid JSON: ' + err.message } })
      setLoading(false); return
    }
    try {
      const baseUrl = apiBase
      const res = await axios.put(`${baseUrl}/profile`, parsed, { withCredentials: true })
      setResult({ ok: true, data: res.data })
      setProfile(res.data.profile)
    } catch (err) {
      setResult({ ok: false, data: err.response?.data || { message: err.message } })
    }
    setLoading(false)
  }

  return (
    <ChallengeShell id={16} title="Profile API" vuln="Mass Assignment" difficulty="medium" backstory={BACKSTORY}>
      <div style={panel}>
        <div style={header}>
          <span style={{ color: '#38bdf8', fontSize: '0.78rem', letterSpacing: '0.1em', fontWeight: 700 }}>NEOCORP PROFILE SERVICE</span>
          <span style={{ color: '#475569', fontSize: '0.68rem' }}>PUT /profile</span>
        </div>

        {profile && (
          <div style={profileBox}>
            <div style={{ color: '#64748b', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>CURRENT PROFILE (as UI sees it)</div>
            <pre style={pre}>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}

        <form onSubmit={submit} style={{ padding: '22px' }}>
          <label style={lbl}>REQUEST BODY (JSON)</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            style={textarea}
            spellCheck={false}
          />
          <button type="submit" style={btn} disabled={loading}>{loading ? 'Updating…' : '>  PUT /profile'}</button>

          
        </form>
      </div>

      {result && (
        <div style={{ ...responseBox, borderColor: result.ok ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)' }}>
          <pre style={pre}>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </ChallengeShell>
  )
}

const panel = { maxWidth: 660, margin: '0 auto', background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, overflow: 'hidden' }
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', background: 'rgba(30,58,138,0.25)', borderBottom: '1px solid rgba(59,130,246,0.1)' }
const profileBox = { padding: '14px 22px', borderBottom: '1px solid rgba(59,130,246,0.08)', background: 'rgba(30,58,138,0.08)' }
const lbl = { display: 'block', fontSize: '0.68rem', color: '#475569', letterSpacing: '0.08em', marginBottom: 6 }
const textarea = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: '#e2e8f0', outline: 'none', marginBottom: 14, minHeight: 140, resize: 'vertical' }
const btn = { width: '100%', padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const code = { background: 'rgba(59,130,246,0.12)', padding: '1px 6px', borderRadius: 3, color: '#93c5fd' }
const responseBox = { maxWidth: 660, margin: '20px auto 0', background: '#090e1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '14px 16px' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
