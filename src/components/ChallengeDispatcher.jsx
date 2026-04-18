import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

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

const CHALLENGE_COMPONENTS = {
  11: Challenge11,
  12: Challenge12,
  13: Challenge13,
  14: Challenge14,
  15: Challenge15,
  16: Challenge16,
  17: Challenge17,
  18: Challenge18,
  19: Challenge19,
  20: Challenge20,
}

// Try to load slug map from backend; fall back to these static slugs if unreachable
const FALLBACK_SLUG_MAP = {
  11: 'node-diag-ac24dc38',
  12: 'svc-nav-e6cec8df',
  13: 'sys-audit-62832fd7',
  14: 'meta-proxy-2027e31f',
  15: 'xml-parser-8690d501',
  16: 'prof-update-6cd37fb8',
  17: 'redeem-hot-2f4328ea',
  18: 'merge-pref-88151040',
  19: 'mail-tpl-1a21e686',
  20: 'compliance-34275d89',
}

export default function ChallengeDispatcher() {
  const { slug } = useParams()
  const [slugMap, setSlugMap] = useState(FALLBACK_SLUG_MAP)  // start with fallback immediately
  const [loading, setLoading] = useState(false)  // fallback available instantly, no initial spinner

  useEffect(() => {
    // Try to fetch live slug map from backend. If it fails, the fallback above is used.
    axios.get('/api/service-map', { timeout: 2000 })
      .then(res => {
        const liveMap = res.data.map
        if (liveMap && Object.keys(liveMap).length > 0) {
          // Normalize: strip /api/ prefix from values
          const normalized = {}
          Object.entries(liveMap).forEach(([id, val]) => {
            normalized[id] = (val || '').replace(/^\/api\//, '').replace(/^\/+/, '')
          })
          setSlugMap(normalized)
        }
      })
      .catch(() => {
        // Backend not updated yet — keep using FALLBACK_SLUG_MAP, it's fine
      })
      .finally(() => setLoading(false))
  }, [])

  // Normalize the current URL slug (strip leading slashes)
  const currentSlug = (slug || '').replace(/^\/+/, '')

  // Find which challenge ID matches
  const matchedId = Object.keys(slugMap).find(id => {
    const mapSlug = (slugMap[id] || '').replace(/^\/+/, '').replace(/^\/api\//, '')
    return mapSlug === currentSlug
  })

  if (loading) {
    return (
      <div style={overlay}>
        <div style={spinnerStyle} />
        <div style={labelStyle}>Resolving internal node...</div>
      </div>
    )
  }

  if (!matchedId) {
    return (
      <div style={overlay}>
        <div style={{ color: '#1a1a3e', fontSize: '3.5rem', fontWeight: 700, marginBottom: 8 }}>404</div>
        <div style={labelStyle}>No internal node found at this address.</div>
        <div style={{ color: '#1e3050', fontSize: '0.65rem', marginTop: 6 }}>
          Slug: <code style={{ color: '#334466' }}>{currentSlug || '(empty)'}</code>
        </div>
      </div>
    )
  }

  const Component = CHALLENGE_COMPONENTS[parseInt(matchedId)]
  if (!Component) {
    return <div style={overlay}><div style={labelStyle}>Challenge component not found.</div></div>
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

const spinnerStyle = {
  width: 28,
  height: 28,
  border: '2px solid #1e293b',
  borderTopColor: '#3b82f6',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

const labelStyle = {
  color: '#334466',
  fontSize: '0.78rem',
  letterSpacing: '0.06em',
}
