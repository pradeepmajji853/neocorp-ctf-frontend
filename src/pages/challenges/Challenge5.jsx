/*
 
 * Students must enumerate profile IDs to find privileged accounts.
 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "By Day 5, the attacker had accessed HR records for all 400+ employees — payroll, reviews, and private contractor files — without triggering a single access control alert.",
  "The profile viewer endpoint authenticates the request but does not check whether the authenticated user is authorized to view the requested resource. Access control was never implemented.",
  "User IDs were assigned sequentially at registration. The attacker needed only a counter and a loop. No rate limiting, no anomaly detection, no audit log.",
  "Your task: locate the profile endpoint. Understand how it identifies resources. Enumerate profile IDs to find accounts with elevated privileges — and access data that should be restricted.",
]

export default function Challenge5() {
  const [userId, setUserId] = useState('')
  const [userResult, setUserResult] = useState(null)
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('/api/challenge5/users').then(r => setUserList(r.data.users || [])).catch(() => {})
  }, [])

  const handleLookup = async (id) => {
    const target = id ?? userId
    if (!target) return
    setLoading(true); setUserResult(null)
    try {
      const res = await axios.get(`/api/challenge5/user/${target}`)
      setUserResult(res.data)
    } catch (err) { setUserResult(err.response?.data || { error: 'Not found' }) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={5} title="Employee Profile Viewer" vuln="IDOR" difficulty="medium" backstory={BACKSTORY}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Directory — no role highlighting */}
        <div>
          <div style={sysLabel}>DIRECTORY ({userList.length} employees)</div>
          {userList.map(u => (
            <div key={u.id} onClick={() => { setUserId(String(u.id)); handleLookup(u.id) }}
              style={{
                padding: '9px 12px', marginBottom: 6, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                background: userId === String(u.id) ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${userId === String(u.id) ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.06)'}`,
              }}>
              <span style={{ color: '#334155', fontSize: '0.65rem', marginRight: 6 }}>#{u.id}</span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{u.username}</span>
            </div>
          ))}
        </div>

        {/* Profile lookup */}
        <div>
          <div style={sysLabel}>PROFILE ENDPOINT — /api/challenge5/user/:id</div>
          <form onSubmit={e => { e.preventDefault(); handleLookup() }} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <input style={{ ...inp, flex: 1 }} type="number" value={userId}
              onChange={e => setUserId(e.target.value)} placeholder="Enter a user ID..." min={1} />
            <button type="submit" style={btnOutline} disabled={loading}>>  Fetch Profile</button>
          </form>

          {userResult && (
            <div style={{ background: '#090e1e', border: `1px solid ${userResult.flag ? 'rgba(52,211,153,0.18)' : 'rgba(59,130,246,0.07)'}`, borderRadius: 8, padding: 14 }}>
              {userResult.flag && (
                <div style={{ color: '#34d399', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
                  🎯 RESTRICTED DATA ACCESSED
                </div>
              )}
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: userResult.flag ? '#34d399' : '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(userResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' }
const btnOutline = { padding: '10px 18px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, background: 'transparent', color: '#38bdf8', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', cursor: 'pointer' }
