import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Challenge1 from './pages/challenges/Challenge1'
import Challenge2 from './pages/challenges/Challenge2'
import Challenge3 from './pages/challenges/Challenge3'
import Challenge4 from './pages/challenges/Challenge4'
import Challenge5 from './pages/challenges/Challenge5'
import Challenge6 from './pages/challenges/Challenge6'
import Challenge7 from './pages/challenges/Challenge7'
import Challenge8 from './pages/challenges/Challenge8'
import Challenge9 from './pages/challenges/Challenge9'
import Challenge10 from './pages/challenges/Challenge10'
import ChallengeDispatcher from './components/ChallengeDispatcher'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Root → redirect to challenge list page */}
        <Route path="/" element={<LandingPage />} />

        {/* Challenges 1-10: direct static paths, no auth needed */}
        <Route path="/challenge-1"  element={<Challenge1 />} />
        <Route path="/challenge-2"  element={<Challenge2 />} />
        <Route path="/challenge-3"  element={<Challenge3 />} />
        <Route path="/challenge-4"  element={<Challenge4 />} />
        <Route path="/challenge-5"  element={<Challenge5 />} />
        <Route path="/challenge-6"  element={<Challenge6 />} />
        <Route path="/challenge-7"  element={<Challenge7 />} />
        <Route path="/challenge-8"  element={<Challenge8 />} />
        <Route path="/challenge-9"  element={<Challenge9 />} />
        <Route path="/challenge-10" element={<Challenge10 />} />

        {/* Challenges 11-20: resolved via secret slug (ChallengeDispatcher) */}
        <Route path="/:slug" element={<ChallengeDispatcher />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function LandingPage() {
  const challenges110 = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div style={page}>
      <div style={container}>
        <div style={logoRow}>
          <span style={logo}>◈</span>
          <span style={brand}>NEOCORP</span>
        </div>
        <h1 style={title}>Internal Security Audit</h1>
        <p style={subtitle}>21 vulnerability assessments. Navigate directly to each node.</p>
        <div style={divider} />

        <div style={sectionLabel}>NODES 01 – 10 // Standard Access</div>
        <div style={grid}>
          {challenges110.map(n => (
            <a key={n} href={`/challenge-${n}`} style={card}>
              <span style={nodeId}>N-{String(n).padStart(2, '0')}</span>
              <span style={arrow}>→</span>
            </a>
          ))}
        </div>

        <div style={{ ...sectionLabel, marginTop: 32 }}>NODES 11 – 21 // Classified Access</div>
        <div style={infoBox}>
          Advanced nodes are accessible only via their assigned internal addresses.
          Reference your operational briefing for exact node paths.
        </div>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div style={page}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', color: '#1a1a2e', fontWeight: 700, marginBottom: 8 }}>404</div>
        <div style={{ color: '#334466', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>
          node not found
        </div>
        <a href="/" style={{ color: '#3b82f6', fontSize: '0.75rem', display: 'block', marginTop: 16 }}>
          ← return to portal
        </a>
      </div>
    </div>
  )
}

// Styles
const page = {
  minHeight: '100vh',
  background: '#050508',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'JetBrains Mono', monospace",
  padding: '40px 20px',
}
const container = { maxWidth: 640, width: '100%' }
const logoRow = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }
const logo = { color: '#3b82f6', fontSize: '1.4rem' }
const brand = { color: '#1e3a5f', fontSize: '0.7rem', letterSpacing: '0.3em', fontWeight: 700 }
const title = { color: '#e2e8f0', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px' }
const subtitle = { color: '#475569', fontSize: '0.78rem', margin: '0 0 24px', lineHeight: 1.6 }
const divider = { height: 1, background: 'rgba(59,130,246,0.1)', marginBottom: 24 }
const sectionLabel = {
  color: '#1e3a5f',
  fontSize: '0.62rem',
  letterSpacing: '0.15em',
  marginBottom: 14,
  textTransform: 'uppercase',
}
const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 8,
}
const card = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  background: 'rgba(59,130,246,0.05)',
  border: '1px solid rgba(59,130,246,0.12)',
  borderRadius: 6,
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.72rem',
  transition: 'all 0.15s',
}
const nodeId = { color: '#3b82f6', fontWeight: 700 }
const arrow = { color: '#1e3a5f' }
const infoBox = {
  background: 'rgba(30,58,138,0.08)',
  border: '1px solid rgba(59,130,246,0.1)',
  borderRadius: 6,
  padding: '14px 18px',
  color: '#475569',
  fontSize: '0.74rem',
  lineHeight: 1.7,
}
