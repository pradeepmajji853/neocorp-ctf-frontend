import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CHALLENGES = [
  { id: 1, title: 'The Breach Begins', vuln: 'SQL Injection', difficulty: 'easy' },
  { id: 2, title: 'Reflected Secrets', vuln: 'Reflected XSS', difficulty: 'easy' },
  { id: 3, title: 'Persistent Payload', vuln: 'Stored XSS', difficulty: 'medium' },
  { id: 4, title: 'Cookie Crumbles', vuln: 'Broken Auth', difficulty: 'medium' },
  { id: 5, title: 'Identity Crisis', vuln: 'IDOR', difficulty: 'easy' },
  { id: 6, title: 'Escape the Cage', vuln: 'Dir Traversal', difficulty: 'medium' },
  { id: 7, title: 'Trojan Upload', vuln: 'File Upload', difficulty: 'medium' },
  { id: 8, title: 'Forged Tokens', vuln: 'JWT Manipulation', difficulty: 'hard' },
  { id: 9, title: 'Hidden Fortress', vuln: 'Hidden Panel', difficulty: 'medium' },
  { id: 10, title: 'Master Access', vuln: 'Role Escalation', difficulty: 'hard' },
  { id: 11, title: 'Network Diagnostics', vuln: 'Command Injection', difficulty: 'easy' },
  { id: 12, title: 'Phishing Gateway', vuln: 'Open Redirect', difficulty: 'easy' },
  { id: 13, title: 'Forgotten Backup', vuln: 'Sensitive Data Exposure', difficulty: 'easy' },
  { id: 14, title: 'URL Preview Service', vuln: 'SSRF', difficulty: 'easy' },
  { id: 15, title: 'Invoice Import', vuln: 'XXE', difficulty: 'medium' },
  { id: 16, title: 'Profile API', vuln: 'Mass Assignment', difficulty: 'medium' },
  { id: 17, title: 'Promo Code Redemption', vuln: 'Race Condition', difficulty: 'hard' },
  { id: 18, title: 'Preferences Merge', vuln: 'Prototype Pollution', difficulty: 'hard' },
  { id: 19, title: 'Email Template Preview', vuln: 'Server-Side Template Injection', difficulty: 'hard' },
  { id: 20, title: 'Audit Log Viewer', vuln: 'Second-Order SQLi', difficulty: 'medium' },
  { id: 21, title: 'Signature Vault', vuln: 'Hash Length Extension', difficulty: 'hard' },
]

const DIFF_COLOR = { easy: '#34d399', medium: '#fbbf24', hard: '#fb923c' }

export default function Dashboard() {
  const { player, solved, logout, refreshProgress, isUnlocked } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { refreshProgress() }, [])

  const pct = Math.round((solved.length / 21) * 100)

  return (
    <div style={page}>
      <div style={gridOverlay} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={logoBadge}>&#9889;</div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.12em' }}>CYBERMINDSPACE</div>
              <div style={{ fontSize: '1.1rem', color: '#e2e8f0', fontWeight: 700 }}>Mission Control</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#475569', fontSize: '0.78rem' }}>{player?.username}</span>
            <button onClick={logout} style={logoutBtn}>Logout</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={progressContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#64748b', fontSize: '0.72rem', letterSpacing: '0.06em' }}>PROGRESS</span>
            <span style={{ color: '#3b82f6', fontSize: '0.72rem' }}>{solved.length}/21 ({pct}%)</span>
          </div>
          <div style={progressTrack}>
            <div style={{ ...progressFill, width: `${pct}%` }} />
          </div>
        </div>

        {/* Challenge grid */}
        <div style={grid}>
          {CHALLENGES.map((ch) => {
            const isSolved = solved.includes(ch.id)
            const unlocked = isUnlocked(ch.id)

            return (
              <div
                key={ch.id}
                onClick={() => {
                  if (!unlocked) return;
                  const secret = serviceMap[ch.id];
                  const path = ch.id >= 11 ? (secret ? `/${secret}` : `/challenge-${ch.id}`) : `/challenge-${ch.id}`;
                  navigate(path);
                }}
                style={{
                  ...card,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.4,
                  borderColor: isSolved
                    ? 'rgba(59,130,246,0.3)'
                    : unlocked
                      ? 'rgba(59,130,246,0.12)'
                      : 'rgba(255,255,255,0.04)',
                }}
              >
                {/* Top row: number + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.65rem', color: '#334155', letterSpacing: '0.08em' }}>
                    CH-{String(ch.id).padStart(2, '0')}
                  </span>
                  {isSolved ? (
                    <span style={badgeSolved}>SOLVED</span>
                  ) : unlocked ? (
                    <span style={badgeActive}>ACTIVE</span>
                  ) : (
                    <span style={badgeLocked}>LOCKED</span>
                  )}
                </div>

                <div style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 700, marginBottom: 6 }}>
                  {unlocked ? ch.title : '???'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: '#475569' }}>{unlocked ? ch.vuln : 'Classified'}</span>
                  {unlocked && (
                    <span style={{
                      fontSize: '0.6rem', padding: '1px 7px', borderRadius: 100,
                      color: DIFF_COLOR[ch.difficulty],
                      border: `1px solid ${DIFF_COLOR[ch.difficulty]}33`,
                      background: `${DIFF_COLOR[ch.difficulty]}11`,
                    }}>
                      {ch.difficulty.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const page = {
  minHeight: '100vh',
  background: '#080d1a',
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  color: '#e2e8f0',
  position: 'relative',
  paddingBottom: 40,
}
const gridOverlay = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
  backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
  backgroundSize: '44px 44px',
}
const header = {
  position: 'relative', zIndex: 1,
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '20px 0', borderBottom: '1px solid rgba(59,130,246,0.1)', marginBottom: 28,
}
const logoBadge = {
  width: 28, height: 28, borderRadius: 6,
  background: 'linear-gradient(135deg,#3b82f6,#818cf8)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 14, boxShadow: '0 0 14px rgba(59,130,246,0.4)',
}
const logoutBtn = {
  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
  color: '#f87171', padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem',
}
const progressContainer = {
  position: 'relative', zIndex: 1, marginBottom: 28,
  padding: '16px 20px', background: '#0b1120',
  border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10,
}
const progressTrack = { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }
const progressFill = {
  height: '100%', borderRadius: 2, transition: 'width 0.6s ease',
  background: 'linear-gradient(90deg, #3b82f6, #38bdf8)',
  boxShadow: '0 0 10px rgba(59,130,246,0.5)',
}
const grid = {
  position: 'relative', zIndex: 1,
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14,
}
const card = {
  background: '#0b1120', border: '1px solid rgba(59,130,246,0.12)',
  borderRadius: 10, padding: '18px 20px', transition: 'all 0.2s ease',
}
const badgeSolved = {
  fontSize: '0.58rem', padding: '2px 8px', borderRadius: 100, letterSpacing: '0.08em',
  color: '#3b82f6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
}
const badgeActive = {
  fontSize: '0.58rem', padding: '2px 8px', borderRadius: 100, letterSpacing: '0.08em',
  color: '#34d399', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)',
}
const badgeLocked = {
  fontSize: '0.58rem', padding: '2px 8px', borderRadius: 100, letterSpacing: '0.08em',
  color: '#475569', background: 'rgba(71,85,105,0.12)', border: '1px solid rgba(71,85,105,0.2)',
}
