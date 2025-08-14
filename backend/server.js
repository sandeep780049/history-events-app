// backend/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---- paths (IMPORTANT: frontend is one level up from backend) ----
const EVENTS_PATH = path.join(__dirname, 'data', 'events.json');     // backend/data/events.json
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');         // ../frontend (root/frontend)

// ---- load events ----
let events = [];
try {
  events = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf8'));
  if (!Array.isArray(events)) events = [];
} catch (e) {
  console.error('Could not read events.json at:', EVENTS_PATH, e.message);
  events = [];
}

// ---- serve static frontend ----
if (fs.existsSync(FRONTEND_DIR)) {
  app.use(express.static(FRONTEND_DIR));
} else {
  console.warn('Frontend folder not found at:', FRONTEND_DIR);
}

// ---- API: events (exact match month AND year to match your script.js) ----
app.get('/api/events', (req, res) => {
  const month = parseInt(req.query.month, 10);
  const year  = parseInt(req.query.year, 10);
  if (!month || !year) return res.status(400).json({ error: 'Month and year are required' });

  const filtered = events.filter(e => Number(e.month) === month && Number(e.year) === year);
  res.json(filtered);
});

// ---- API: quiz (one random event from the same set) ----
app.post('/api/quiz', (req, res) => {
  const month = parseInt(req.body.month, 10);
  const year  = parseInt(req.body.year, 10);
  if (!month || !year) return res.status(400).json({ error: 'Month and year are required' });

  const pool = events.filter(e => Number(e.month) === month && Number(e.year) === year);
  if (pool.length === 0) return res.json({ question: null, answer: null });

  const ev = pool[Math.floor(Math.random() * pool.length)];
  res.json({
    question: `In which year did this happen: "${ev.event}"?`,
    answer: Number(ev.year)
  });
});

// ---- SPA fallback: send index.html for any non-API path ----
app.get(/^(?!\/api).*/, (req, res) => {
  const idx = path.join(FRONTEND_DIR, 'index.html');
  if (fs.existsSync(idx)) return res.sendFile(idx);
  return res
    .status(500)
    .send(`index.html not found. Expected at: ${idx}`);
});

// ---- start ----
app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
  console.log('  ├─ events file:', EVENTS_PATH);
  console.log('  └─ frontend dir:', FRONTEND_DIR);
});
