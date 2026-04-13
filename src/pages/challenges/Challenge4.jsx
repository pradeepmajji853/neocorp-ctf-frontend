/*
 * Challenge 4: Broken Authentication (Weak Base64 Session Cookie)
 * Students must decode the base64 token themselves, forge it, and submit.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "On Day 4, forensic logs show the attacker connecting from a new IP — still authenticated as a privileged user without any new login attempt. The session had somehow persisted across accounts.",
  "NeoCorp issued persistent session tokens using a mechanism that looked secure to the team but wasn't. The token is issued at login and sent with every subsequent request in the X-Session-Token header.",
  "The server decodes this token on every request and grants access based on its contents — without verifying that the token hasn't been tampered with. There is no cryptographic signature.",
  "Log in with your issued credentials. Examine the token. Figure out its structure using standard tools. Then present a modified token that gets you access to a privileged profile.",
]

export default function Challenge4() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginResult, setLoginResult] = useState(null)
  const [sessionToken, setSessionToken] = useState('')
  const [profileResult, setProfileResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post('/api/challenge4/login', { username, password }, { withCredentials: true })
      setLoginResult(res.data)
      if (res.data.session_token) setSessionToken(res.data.session_token)
    } catch (err) { setLoginResult(err.response?.data || { error: 'Login failed' }) }
    setLoading(false)
  }

  const handleProfile = async () => {
    if (!sessionToken) return
    setLoading(true)
    try {
      const res = await axios.get('/api/challenge4/profile', {
        withCredentials: true, headers: { 'X-Session-Token': sessionToken }
      })
      setProfileResult(res.data)
    } catch (err) { setProfileResult(err.response?.data || { error: 'Access denied' }) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={4} title="Employee Portal — Session" vuln="Broken Authentication" difficulty="medium" backstory={BACKSTORY}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Login */}
        <div style={panel}>
          <div style={sysLabel}>NEOCORP PORTAL — LOGIN</div>
          <form onSubmit={handleLogin}>
            <input style={{ ...inp, marginBottom: 10 }} type="text" placeholder="username"
              value={username} onChange={e => setUsername(e.target.value)} />
            <input style={{ ...inp, marginBottom: 12 }} type="password" placeholder="password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" style={{ ...btnPrimary, width: '100%' }} disabled={loading}>> Authenticate</button>
          </form>

          {loginResult && (
            <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 10 }}>
              <pre style={pre}>{JSON.stringify(loginResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Profile access */}
        <div style={panel}>
          <div style={sysLabel}>PROFILE ACCESS — X-SESSION-TOKEN HEADER</div>
          <div style={{ color: '#334155', fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 12 }}>
            Authenticated requests must include the session token in the <code style={code}>X-Session-Token</code> header.
            The server validates the token to determine your access level.
          </div>
          <textarea style={{ ...inp, resize: 'vertical', marginBottom: 10, fontSize: '0.78rem', wordBreak: 'break-all' }}
            value={sessionToken}
            onChange={e => setSessionToken(e.target.value)}
            placeholder="Session token from login response..."
            rows={4}
          />
          <button onClick={handleProfile} style={{ ...btnOutline, width: '100%' }} disabled={loading || !sessionToken}>
            {loading ? 'Checking...' : '> Access Profile Endpoint'}
          </button>

          {profileResult && (
            <div style={{ marginTop: 12, background: profileResult.flag ? 'rgba(52,211,153,0.05)' : 'rgba(0,0,0,0.2)', border: `1px solid ${profileResult.flag ? 'rgba(52,211,153,0.2)' : 'rgba(59,130,246,0.08)'}`, borderRadius: 6, padding: 12 }}>
              {profileResult.flag && <div style={{ color: '#34d399', fontSize: '0.68rem', marginBottom: 6 }}>🎯 ACCESS GRANTED</div>}
              <pre style={{ ...pre, color: profileResult.flag ? '#34d399' : '#94a3b8' }}>{JSON.stringify(profileResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const panel = { background: 'rgba(11,17,32,0.8)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10, padding: 20 }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none' }
const btnPrimary = { padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', fontWeight: 700 }
const btnOutline = { padding: '10px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
const code = { color: '#38bdf8', background: 'rgba(56,189,248,0.08)', padding: '1px 5px', borderRadius: 3, fontSize: '0.9em' }
