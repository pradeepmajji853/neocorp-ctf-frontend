import React from 'react'
import { useParams } from 'react-router-dom'

// Challenge components (11-20)
import Challenge11 from '../pages/challenges/Challenge11'
import Challenge12 from '../pages/challenges/Challenge12'
import Challenge13 from '../pages/challenges/Challenge13'
import Challenge14 from '../pages/challenges/Challenge14'
import Challenge15 from '../pages/challenges/Challenge15'
import Challenge16 from '../pages/challenges/Challenge16'
import Challenge17 from '../pages/challenges/Challenge17'
import Challenge18 from '../pages/challenges/Challenge18'
import Challenge19 from '../pages/challenges/Challenge19'
import Challenge20 from '../pages/challenges/Challenge20'

// Static slug → challenge ID mapping (hardcoded from backend .env)
// These slugs are unguessable but fixed — no backend call needed.
const SLUG_MAP = {
  'node-diag-ac24dc38':  Challenge11,
  'svc-nav-e6cec8df':    Challenge12,
  'sys-audit-62832fd7':  Challenge13,
  'meta-proxy-2027e31f': Challenge14,
  'xml-parser-8690d501': Challenge15,
  'prof-update-6cd37fb8':Challenge16,
  'redeem-hot-2f4328ea': Challenge17,
  'merge-pref-88151040': Challenge18,
  'mail-tpl-1a21e686':   Challenge19,
  'compliance-34275d89': Challenge20,
}

export default function ChallengeDispatcher() {
  const { slug } = useParams()

  // Normalize slug — strip any accidental leading slashes
  const cleanSlug = (slug || '').replace(/^\/+/, '')

  const Component = SLUG_MAP[cleanSlug]

  if (!Component) {
    return (
      <div style={overlay}>
        <div style={{ color: '#1a1a3e', fontSize: '3.5rem', fontWeight: 700, marginBottom: 8 }}>404</div>
        <div style={labelStyle}>No internal node found at this address.</div>
        <a href="/" style={{ color: '#3b82f6', fontSize: '0.75rem', marginTop: 14, display: 'block' }}>
          ← Return to portal
        </a>
      </div>
    )
  }

  return <Component />
}

const overlay = {
  minHeight: '100vh',
  background: '#050508',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 10,
  fontFamily: "'JetBrains Mono', monospace",
}

const labelStyle = {
  color: '#334466',
  fontSize: '0.78rem',
  letterSpacing: '0.06em',
}
