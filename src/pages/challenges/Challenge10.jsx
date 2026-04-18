/*
 
 * Students must ACTUALLY edit the neocorp_role cookie via DevTools. No simulator.
 * The _role_override query param has been removed from the backend.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "Day 11. The attacker's final move. NeoCorp's master control dashboard — used by the CTO and two senior engineers — controls access to the production database, backup encryption keys, and incident response runbooks.",
  "Access is gated by role. Every request, the server reads the user's role from a browser cookie and grants permissions accordingly. The cookie value is a plain string. It has no cryptographic signature. The server trusts it unconditionally.",
  "The attacker made no network requests to change their role. They didn't call an API. They opened a browser panel, located the relevant cookie, changed three characters, and closed the panel. That was it.",
  "Initialize your session, then find the cookie your browser has stored. Modify its value to gain master access to the dashboard.",
]

export default function Challenge10() {
  const [dashResult, setDashResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const handleInit = async () => {
    try {
      await axios.get('/api/challenge10/init', { withCredentials: true })
      setInitialized(true)
    } catch {}
  }

  const handleDashboard = async () => {
    setLoading(true); setDashResult(null)
    try {
      // IMPORTANT: no _role_override param — the backend now reads strictly from cookie
      const res = await axios.get('/api/challenge10/dashboard', { withCredentials: true })
      setDashResult(res.data)
    } catch (err) { setDashResult(err.response?.data) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={10} title="Master Control Dashboard" vuln="Cookie Manipulation" difficulty="hard" backstory={BACKSTORY}>
      <div style={{ maxWidth: 560 }}>
        <div style={sysLabel}>NEOCORP MASTER CONTROL SYSTEM</div>

        {/* Step 1 */}
        <div style={{ ...panel, marginBottom: 16 }}>
          <div style={sysLabel}>STEP 1 — INITIALIZE SESSION</div>
          <div style={{ color: '#334155', fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 14 }}>
            Create an authenticated session. This will set a role cookie in your browser.
            Use your browser's built-in developer tools to inspect and, if necessary, modify it.
          </div>
          <button onClick={handleInit} style={btnOutline}>
            {'> '} Initialize Session
          </button>
          {initialized && (
            <div style={{ marginTop: 10, color: '#34d399', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem' }}>
              ✓ Session initialized — check your browser's Application → Cookies panel.
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div style={{ ...panel, marginBottom: 16 }}>
          <div style={sysLabel}>STEP 2 — ACCESS THE DASHBOARD</div>
          <div style={{ color: '#334155', fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 14 }}>
            Once your session is active, click below to request the dashboard.
            The server will determine your access level and return the appropriate data.
          </div>
          <button onClick={handleDashboard} style={btnPrimary} disabled={loading}>
            {loading ? 'Loading...' : '{'> '} Request Dashboard'}
          </button>
        </div>

        {/* Response */}
        {dashResult && (
          dashResult.flag ? (
            <div style={{
              padding: 24,
              background: 'linear-gradient(135deg,rgba(14,20,40,0.95),rgba(11,17,32,0.98))',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: 12,
              boxShadow: '0 0 50px rgba(59,130,246,0.07)',
            }}>
              <div style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 14 }}>
                🏆 MASTER ACCESS GRANTED — ALL SYSTEMS UNLOCKED
              </div>
              <div style={{ color: '#34d399', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', marginBottom: 20, wordBreak: 'break-all' }}>
                {dashResult.flag}
              </div>
              {dashResult.classified && (
                <div style={{ borderTop: '1px solid rgba(59,130,246,0.1)', paddingTop: 16 }}>
                  <div style={{ color: '#1e293b', fontSize: '0.6rem', letterSpacing: '0.12em', marginBottom: 14, textTransform: 'uppercase' }}>
                    ▸ Classified Division Report
                  </div>
                  {Object.entries(dashResult.classified).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 14 }}>
                      <div style={{ color: '#334155', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        {k.replace(/_/g, ' ')}
                      </div>
                      <div style={{ color: k === 'final_message' ? '#38bdf8' : '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: k === 'final_message' ? 'italic' : 'normal', fontWeight: k === 'final_message' ? 600 : 400 }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={panel}>
              <div style={{ color: '#475569', fontSize: '0.72rem', marginBottom: 8 }}>
                Dashboard — Current role: <span style={{ color: '#94a3b8', fontWeight: 700 }}>{dashResult.current_role}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: dashResult.data ? 10 : 0 }}>{dashResult.message}</div>
              {dashResult.data && (
                <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(dashResult.data, null, 2)}
                </pre>
              )}
            </div>
          )
        )}
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const panel = { background: 'rgba(11,17,32,0.8)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10, padding: 20 }
const btnPrimary = { padding: '12px 28px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.9rem', fontWeight: 700, boxShadow: '0 0 24px rgba(59,130,246,0.3)' }
const btnOutline = { padding: '10px 18px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
