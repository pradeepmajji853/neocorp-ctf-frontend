/*
 * Challenge 7: File Upload Vulnerability (MIME Type Bypass)
 * The MIME override is present but not labeled. Students must figure out what it does.
 */
import React, { useState } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "On Day 7, the attacker uploaded a file to NeoCorp's document portal. The upload feature claimed to accept only images and PDFs. Three hours later, it had been used to exfiltrate the production database schema.",
  "NeoCorp's security team reviewed the server logs. The uploaded file had a .jpg extension and was listed as image/jpeg by the server. But when they opened it, it wasn't an image.",
  "The developer who built the upload feature validated file type using only the metadata the HTTP client provides — not the actual binary content. That metadata is entirely controlled by the person making the request.",
  "Your task: upload a file to this endpoint. Understand how the server decides what's acceptable and what isn't. Find a way to get a file with unexpected contents accepted.",
]

const CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/octet-stream',
  'text/html',
  'application/x-php',
]

export default function Challenge7() {
  const [file, setFile] = useState(null)
  const [contentType, setContentType] = useState('image/jpeg')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true); setResult(null)
    const blob = new Blob([file], { type: contentType })
    const modified = new File([blob], file.name, { type: contentType })
    const form = new FormData()
    form.append('document', modified)
    try {
      const res = await axios.post('/api/challenge7/upload', form)
      setResult(res.data)
    } catch (err) { setResult(err.response?.data || { error: 'Upload failed' }) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={7} title="Document Upload Portal" vuln="File Upload Bypass" difficulty="medium" backstory={BACKSTORY}>
      <div style={{ maxWidth: 520 }}>
        <div style={sysLabel}>NEOCORP DOCUMENT ARCHIVE — FILE SUBMISSION</div>
        <div style={{ color: '#334155', fontSize: '0.75rem', lineHeight: 1.7, marginBottom: 20 }}>
          Submit internal documents for archiving. Accepted formats: JPEG, PNG, GIF, PDF, TXT.
        </div>

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: 16 }}>
            <div style={sysLabel}>DOCUMENT</div>
            <input type="file" onChange={e => setFile(e.target.files[0])}
              style={{ color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.82rem', width: '100%' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={sysLabel}>DOCUMENT TYPE</div>
            <select value={contentType} onChange={e => setContentType(e.target.value)}
              style={{ ...inp, width: '100%', boxSizing: 'border-box' }}>
              {CONTENT_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <button type="submit" style={{ ...btnPrimary, width: '100%' }} disabled={loading || !file}>
            {loading ? 'Uploading...' : '> Submit Document'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: 16,
            background: result.flag ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${result.flag ? 'rgba(52,211,153,0.2)' : 'rgba(59,130,246,0.08)'}`,
            borderRadius: 8, padding: 14,
          }}>
            {result.flag && (
              <div style={{ color: '#34d399', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
                🎯 ANOMALOUS UPLOAD DETECTED — INCIDENT LOG ENTRY CREATED
              </div>
            )}
            <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', color: result.flag ? '#34d399' : '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }
const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85rem', color: '#e2e8f0', outline: 'none' }
const btnPrimary = { padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700, boxShadow: '0 0 20px rgba(59,130,246,0.25)' }
