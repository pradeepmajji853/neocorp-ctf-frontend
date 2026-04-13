# Cybermindspace CTF — Web Exploitation Path

> ⚠️ **This application is intentionally vulnerable for educational purposes only.**
> **DO NOT deploy on a public-facing server.**

A full-stack CTF (Capture the Flag) platform for learning web exploitation techniques. Follow the storyline of a cybersecurity trainee investigating a compromised fictional company (NeoCorp) through 10 progressive challenges.

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:4000
```

### 2. Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Open your browser

Navigate to **http://localhost:3000** and begin the investigation.

---

## Challenge List

| # | Title | Vulnerability | Difficulty | Flag |
|---|-------|--------------|-----------|------|
| 1 | The Breach Begins | SQL Injection | Easy | `flag{cybermindspace_sqli_7f3a2b9c}` |
| 2 | Signal in the Noise | Reflected XSS | Easy | `flag{cybermindspace_xss_reflected_4d1e8f2a}` |
| 3 | Planting Seeds | Stored XSS | Easy-Med | `flag{cybermindspace_xss_stored_9b3c7d5f}` |
| 4 | Session Ghost | Broken Auth | Medium | `flag{cybermindspace_broken_auth_2e6a4f1b}` |
| 5 | Numbered Targets | IDOR | Medium | `flag{cybermindspace_idor_8c2d9e3a}` |
| 6 | The Hidden Path | Directory Traversal | Medium | `flag{cybermindspace_traversal_5f7b1a3e}` |
| 7 | Trojan Document | File Upload Bypass | Med-Hard | `flag{cybermindspace_upload_1d4e8b6f}` |
| 8 | Token Thief | JWT Manipulation | Hard | `flag{cybermindspace_jwt_6a2f9c3d}` |
| 9 | Ghost Protocol | Hidden Panel Discovery | Hard | `flag{cybermindspace_hidden_panel_3e7a1f5c}` |
| 10 | Root of All Evil | Cookie Manipulation | Hard | `flag{cybermindspace_MASTER_3a9f1d7e2b}` |

---

## File Structure

```
vulnerableapp/
├── backend/
│   └── src/
│       ├── db/database.js          # SQLite DB + seed data
│       ├── routes/
│       │   ├── challenge1.js       # SQL Injection
│       │   ├── challenge2.js       # Reflected XSS
│       │   ├── challenge3.js       # Stored XSS
│       │   ├── challenge4.js       # Broken Auth
│       │   ├── challenge5.js       # IDOR
│       │   ├── challenge6.js       # Directory Traversal
│       │   ├── challenge7.js       # File Upload
│       │   ├── challenge8.js       # JWT Manipulation
│       │   ├── challenge9.js       # Hidden Admin Panel
│       │   ├── challenge10.js      # Cookie Manipulation
│       │   └── progress.js         # Progress & Flag Submission
│       └── index.js               # Express entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ChallengeCard.jsx
        │   ├── ChallengeLayout.jsx
        │   ├── FlagSubmit.jsx
        │   ├── HintBox.jsx
        │   ├── Navbar.jsx
        │   └── Terminal.jsx
        ├── context/ProgressContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Dashboard.jsx
        │   └── challenges/
        │       ├── Challenge1.jsx – Challenge10.jsx
        └── styles/index.css
```

---

## CTF Solutions (Instructor Reference)

### Challenge 1 — SQL Injection
- Username: `' OR '1'='1'--`
- Password: anything
- This injects into: `SELECT * FROM users WHERE username='...' AND password='...'`

### Challenge 2 — Reflected XSS
- Search with `<script>alert(1)</script>` — flag is in `X-Secret-Flag` response header
- Open DevTools > Network > inspect the search response headers

### Challenge 3 — Stored XSS
- Post a comment with `<script>document.write(document.cookie)</script>`
- Server simulates admin bot visiting and returns stolen cookie with flag

### Challenge 4 — Broken Authentication
- Login as `employee:employee123`.
- The server sets a `neocorp_session` cookie containing `base64("username|role|timestamp")`.
- Decode your cookie, change the role part to `admin`, re-encode it in base64, and replace your cookie value.
- Refresh `/api/challenge4/profile` to get the flag.

### Challenge 5 — IDOR
- GET /api/challenge5/user/1 → admin account with flag

### Challenge 6 — Directory Traversal
- `?file=../../secret/flag6.txt`

### Challenge 7 — File Upload
- Create a file containing `<?php echo 'pwned'; ?>` or `FLAG_REQUEST`
- Upload it with MIME type `image/jpeg` selected

### Challenge 8 — JWT Manipulation
- Get token, decode at jwt.io
- Change role to "admin", re-sign with secret: `secret`
- Or: set alg to "none", remove signature

### Challenge 9 — Hidden Panel
- robots.txt disallows `/hidden-admin-v2`
- Login: admin:cybermindspace2024

### Challenge 10 — Cookie Manipulation
- Select "superadmin" role in the simulator
- In real browser: DevTools > Application > Cookies > change `neocorp_role` to `superadmin`

---

*Cybermindspace — Web Exploitation Training Platform*
*"Hack to learn. Learn to defend."*
