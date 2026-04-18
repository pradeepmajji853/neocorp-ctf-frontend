/*
 * ChallengeShell — Minimal wrapper for each standalone challenge page.
 * No navigation, no flag submission, no links to other challenges.
 */
import React from 'react'

const DIFF_COLOR = { easy: '#34d399', medium: '#fbbf24', hard: '#fb923c' }
const DIFF_BG   = { easy: 'rgba(52,211,153,0.1)', medium: 'rgba(251,191,36,0.1)', hard: 'rgba(251,146,60,0.1)' }

export default function ChallengeShell({ id, title, vuln, difficulty, backstory, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080d1a',
      backgroundImage: [
        'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 60%)',
        'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
      ].join(', '),
      backgroundSize: 'auto, 44px 44px, 44px 44px',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: '#e2e8f0',
    }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(59,130,246,0.12)',
        padding: '0 28px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(8,13,26,0.85)',
        backdropFilter: 'blur(14px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Left: brand + challenge label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            paddingRight: 16,
            borderRight: '1px solid rgba(59,130,246,0.12)',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 5,
              background: 'linear-gradient(135deg,#3b82f6,#818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, boxShadow: '0 0 12px rgba(59,130,246,0.4)',
            }}>⚡</div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.1em' }}>
              CYBERMINDSPACE
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.65rem', color: '#334155', letterSpacing: '0.06em' }}>
              CH-{String(id).padStart(2, '0')}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.65rem' }}>›</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>{title}</span>
          </div>
        </div>
      </div>

      {/* ── Page content ────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Backstory panel */}
        {backstory && (
          <div style={{
            marginBottom: 32,
            padding: '20px 24px',
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(59,130,246,0.18)',
            borderLeft: '3px solid #3b82f6',
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* subtle glow behind */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 200, height: 80,
              background: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.08), transparent)',
              pointerEvents: 'none',
            }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 12,
              fontSize: '0.68rem', color: '#3b82f6', letterSpacing: '0.12em', fontWeight: 700,
            }}>
              <span style={{ opacity: 0.7 }}>▸</span> SITUATION REPORT — CYBERMINDSPACE INTEL DIVISION
            </div>
            {backstory.map((line, i) => (
              <p key={i} style={{
                margin: i < backstory.length - 1 ? '0 0 8px' : 0,
                color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.75,
              }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Challenge interface */}
        {children}
      </div>
    </div>
  )
}
