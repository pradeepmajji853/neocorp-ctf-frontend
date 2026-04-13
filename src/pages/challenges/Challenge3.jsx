/*
 * Challenge 3: Stored XSS (Bulletin Board)
 * This application is intentionally vulnerable for educational purposes only.
 */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChallengeShell from '../../components/ChallengeShell'

const BACKSTORY = [
  "NeoCorp's internal bulletin board was built during a hackathon. It stores employee messages in a database and renders them directly in the browser — no sanitization, no escaping.",
  "The breach timeline shows the attacker posted a seemingly harmless message to the board on Day 3. A privileged admin bot visits the board hourly to screen new posts for policy violations.",
  "When the bot rendered the attacker's message, a script executed in its context — silently exfiltrating the admin session cookie. This was the pivot point for the entire breach.",
  "Your mission: replicate that attack. Post a comment containing a client-side payload. If the admin bot triggers it, its session data — including the flag — will surface in the server's response.",
]

export default function Challenge3() {
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const [comments, setComments] = useState([])
  const [postResult, setPostResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    try { const r = await axios.get('/api/challenge3/comments'); setComments(r.data.comments || []) } catch {}
  }

  useEffect(() => { fetchComments() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setPostResult(null)
    try {
      const res = await axios.post('/api/challenge3/comment', { username, content })
      setPostResult(res.data); await fetchComments()
    } catch (err) { setPostResult(err.response?.data || { error: 'Post failed' }) }
    setLoading(false)
  }

  return (
    <ChallengeShell id={3} title="Internal Bulletin Board" vuln="Stored XSS" difficulty="easy" backstory={BACKSTORY}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Post form */}
        <div>
          <div style={sysLabel}>POST A MESSAGE</div>
          <form onSubmit={handleSubmit}>
            <input style={{ ...inp, marginBottom: 10 }} type="text" value={username}
              onChange={e => setUsername(e.target.value)} placeholder="Your name" />
            <textarea style={{ ...inp, resize: 'vertical', marginBottom: 12 }} value={content}
              onChange={e => setContent(e.target.value)} placeholder="Write your message... (HTML supported)" rows={5} />
            <button type="submit" style={{ ...btnPrimary, width: '100%' }} disabled={loading}>
              {loading ? 'Posting...' : '> Post Message'}
            </button>
          </form>

          {postResult?.adminBotResponse && (
            <div style={{ marginTop: 14, background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, padding: 14 }}>
              <div style={{ color: '#34d399', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: 8 }}>
                🎯 ADMIN BOT TRIGGERED — COOKIE STOLEN:
              </div>
              <pre style={{ ...pre, color: '#34d399' }}>{postResult.adminBotResponse.stolen_cookie}</pre>
            </div>
          )}

          {postResult && !postResult.adminBotResponse && !postResult.error && (
            <div style={{ marginTop: 12 }}>
              <div style={{ color: '#38bdf8', fontSize: '0.72rem', fontFamily: "'JetBrains Mono',monospace" }}>
                ✓ Comment #{postResult.commentId} posted.
              </div>
            </div>
          )}
        </div>

        {/* Comment feed — intentionally renders raw HTML */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={sysLabel}>BOARD ({comments.length} posts)</div>
            <button onClick={fetchComments} style={{ background: 'none', border: 'none', color: '#334155', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', cursor: 'pointer' }}>↻ Refresh</button>
          </div>
          <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
            {comments.map(c => (
              <div key={c.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#38bdf8', fontSize: '0.78rem' }}>@{c.username}</span>
                  <span style={{ color: '#1e293b', fontSize: '0.65rem' }}>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                {/* INTENTIONAL: raw HTML rendered — stored XSS */}
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: c.content }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChallengeShell>
  )
}

const sysLabel = { color: '#1e293b', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }
const inp = { display: 'block', width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6, padding: '10px 13px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', color: '#e2e8f0', outline: 'none' }
const btnPrimary = { padding: '11px', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#818cf8)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88rem', fontWeight: 700 }
const card = { padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(59,130,246,0.08)', borderRadius: 6, marginBottom: 8 }
const pre = { margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.78rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
