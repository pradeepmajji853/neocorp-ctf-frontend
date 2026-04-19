import React, { useState, useEffect } from 'react'
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
import Challenge21 from '../pages/challenges/Challenge21'
import Challenge22 from '../pages/challenges/Challenge22'
import Challenge23 from '../pages/challenges/Challenge23'
import Challenge24 from '../pages/challenges/Challenge24'
import Challenge25 from '../pages/challenges/Challenge25'
import Challenge26 from '../pages/challenges/Challenge26'
import Challenge27 from '../pages/challenges/Challenge27'
import Challenge28 from '../pages/challenges/Challenge28'

// Frontend slug → challenge number mapping (hardcoded — frontend never changes)
const SLUG_TO_ID = {
  'node-diag-ac24dc38':   11,
  'svc-nav-e6cec8df':     12,
  'sys-audit-62832fd7':   13,
  'meta-proxy-2027e31f':  14,
  'xml-parser-8690d501':  15,
  'prof-update-6cd37fb8': 16,
  'redeem-hot-2f4328ea':  17,
  'merge-pref-88151040':  18,
  'mail-tpl-1a21e686':    19,
  'compliance-34275d89':  20,
  'sig-vault-d39c7a81':   21,
  'challenge-22':         22,
  'challenge-23':         23,
  'challenge-24':         24,
  'challenge-25':         25,
  'challenge-26':         26,
  'challenge-27':         27,
  'challenge-28':         28,
}

const ID_TO_COMPONENT = {
  11: Challenge11, 12: Challenge12, 13: Challenge13,
  14: Challenge14, 15: Challenge15, 16: Challenge16,
  17: Challenge17, 18: Challenge18, 19: Challenge19,
  20: Challenge20, 21: Challenge21, 22: Challenge22, 23: Challenge23,
  24: Challenge24, 25: Challenge25, 26: Challenge26, 27: Challenge27, 28: Challenge28,
}

export default function ChallengeDispatcher() {
  const { slug } = useParams()
  const cleanSlug = (slug || '').replace(/^\/+/, '')
  const challengeId = SLUG_TO_ID[cleanSlug]

  // apiBase: the backend's actual API path for this challenge.
  // Starts as null — fetched from /api/service-map on mount.
  const [apiBase, setApiBase] = useState(null)

  useEffect(() => {
    if (!challengeId) return
    axios.get('/api/service-map', { timeout: 4000 })
      .then(res => {
        const liveMap = res.data?.map || {}
        // liveMap[id] = "challenge11" or "node-diag-ac24dc38" depending on env vars
        const backendSlug = liveMap[challengeId]
        if (backendSlug) {
          setApiBase(`/api/${backendSlug}`)
        } else {
          // Fallback: use default challenge path
          setApiBase(`/api/challenge${challengeId}`)
        }
      })
      .catch(() => {
        // If backend is unreachable, fall back to default path
        setApiBase(`/api/challenge${challengeId}`)
      })
  }, [challengeId])

  // Unknown slug — show 404
  if (!challengeId) {
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

  // Show loading while we fetch the correct API path from the backend
  if (!apiBase) {
    return (
      <div style={overlay}>
        <div style={spinnerStyle} />
        <div style={labelStyle}>Connecting to internal node...</div>
      </div>
    )
  }

  const Component = ID_TO_COMPONENT[challengeId]
  return <Component apiBase={apiBase} />
}

const overlay = {
  minHeight: '100vh', background: '#050508', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  flexDirection: 'column', gap: 10,
  fontFamily: "'JetBrains Mono', monospace",
}
const spinnerStyle = {
  width: 28, height: 28,
  border: '2px solid #1e293b', borderTopColor: '#3b82f6',
  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
}
const labelStyle = { color: '#334466', fontSize: '0.78rem', letterSpacing: '0.06em' }
