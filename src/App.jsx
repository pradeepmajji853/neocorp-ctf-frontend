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

/*
 * This application is intentionally vulnerable for educational purposes only.
 * Each challenge is a standalone page — no progression, no linking between challenges.
 * Flag submission is handled by the parent Cybermindspace platform.
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Each challenge is independently accessible — no locking, no progression */}
        <Route path="/challenge-1" element={<Challenge1 />} />
        <Route path="/challenge-2" element={<Challenge2 />} />
        <Route path="/challenge-3" element={<Challenge3 />} />
        <Route path="/challenge-4" element={<Challenge4 />} />
        <Route path="/challenge-5" element={<Challenge5 />} />
        <Route path="/challenge-6" element={<Challenge6 />} />
        <Route path="/challenge-7" element={<Challenge7 />} />
        <Route path="/challenge-8" element={<Challenge8 />} />
        <Route path="/challenge-9" element={<Challenge9 />} />
        <Route path="/challenge-10" element={<Challenge10 />} />

        {/* No home page — redirect any unknown route to a plain not-found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'JetBrains Mono, monospace',
      color: '#555577',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: '4rem', color: '#1a1a2e' }}>404</div>
      <div style={{ color: '#333355', fontSize: '0.85rem' }}>neocorp internal systems — no public access</div>
    </div>
  )
}
