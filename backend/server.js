// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ---------- Load & normalize events ----------
const eventsPath = path.join(__dirname, 'data', 'events.json');

let eventsRaw = [];
try {
  eventsRaw = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
} catch (err) {
  console.error('Failed to read data/events.json:', err.message);
  eventsRaw = [];
}

const events = (Array.isArray(eventsRaw) ? eventsRaw : []).map(e => ({
  ...e,
  month: parseInt(e.month, 10),
  year: parseInt(e.year, 10)
})).filter(e => Number.isInteger(e.month) && Number.isInteger(e.year));

function filterEvents(month, year, mode = 'or') {
  const m = Number(month);
  const y = Number(year);

  // If both provided:
  if (!Number.isNaN(m) && !Number.isNaN(y)) {
    if (mode === 'exact') return events.filter(e => e.month === m && e.year === y);
    if (mode === 'month') return events.filter(e => e.month === m);
    if (mode === 'year') return events.filter(e => e.year === y);
    // default: 'or'
    return events.filter(e => e.month === m || e.year === y);
  }

  // Only month provided
  if (!Number.isNaN(m) && Number.isNaN(y)) {
    return events.filter(e => e.month === m);
  }

  // Only year provided
  if (Number.isNaN(m) && !Number.isNaN(y)) {
    return events.filter(e => e.year === y);
  }

  // Neither provided — return empty to avoid dumping all
  return [];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeYearOptions(correctYear) {
  const opts = new Set([String(correctYear)]);
  while (opts.size < 4) {
    // generate plausible distractors near the correct year
    const delta = Math.floor(Math.random() * 51) - 25; // -25..+25
    const cand = String(correctYear + (delta === 0 ? 1 : delta));
    opts.add(cand);
  }
  return shuffle(Array.from(opts));
}

// ---------- API: health ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, eventsCount: events.length });
});

// ---------- API: events (query) ----------
app.get('/api/events', (req, res) => {
  const { month, year, mode } = req.query; // mode: 'or' (default) | 'exact' | 'month' | 'year'
  const results = filterEvents(month, year, mode || 'or');
  res.json(results);
});

// ---------- API: events (path params) ----------
app.get('/api/events/:month/:year', (req, res) => {
  const { month, year } = req.params;
  // default to 'or' to show more results
  const results = filterEvents(month, year, 'or');
  res.json(results);
});

// ---------- API: quiz (query) ----------
app.get('/api/events/quiz', (req, res) => {
  const { month, year } = req.query;
  const pool = filterEvents(month, year, 'or');

  if (pool.length < 4) return res.json([]); // not enough for decent MCQs

  const questionsFrom = shuffle(pool).slice(0, Math.min(5, pool.length));

  const quiz = questionsFrom.map((ev, idx) => ({
    // Include a simple id so the checker can find the event reliably
    id: `${ev.date || ''}_${ev.event.slice(0, 40)}_${idx}`,
    question: `In which year did this happen? — ${ev.event}`,
    options: makeYearOptions(ev.year),
    answer: String(ev.year)
  }));

  res.json(quiz);
});

// ---------- API: quiz (path params) ----------
app.get('/api/events/quiz/:month/:year', (req, res) => {
  const { month, year } = req.params;
  const pool = filterEvents(month, year, 'or');

  if (pool.length < 4) return res.json([]);

  const questionsFrom = shuffle(pool).slice(0, Math.min(5, pool.length));

  const quiz = questionsFrom.map((ev, idx) => ({
    id: `${ev.date || ''}_${ev.event.slice(0, 40)}_${idx}`,
    question: `In which year did this happen? — ${ev.event}`,
    options: makeYearOptions(ev.year),
    answer: String(ev.year)
  }));

  res.json(quiz);
});

// ---------- API: quiz check ----------
app.post('/api/events/quiz/check', (req, res) => {
  const { answers } = req.body; // [{ question, selected }]
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array' });
  }

  let score = 0;

  const results = answers.map((ans) => {
    // Find the event by matching the event text inside the question
    const matched = events.find(e => ans.question && ans.question.includes(e.event));
    const correct = matched ? String(matched.year) : null;
    const isCorrect = !!correct && String(ans.selected) === correct;
    if (isCorrect) score += 1;

    return {
      question: ans.question,
      selected: ans.selected ?? null,
      correct,
      isCorrect
    };
  });

  res.json({ score, total: answers.length, results });
});

// ---------- Static frontend ----------
const publicDir = path.join(__dirname, 'public');
const altFrontendDir = path.join(__dirname, 'frontend');

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else if (fs.existsSync(altFrontendDir)) {
  app.use(express.static(altFrontendDir));
}

// Fallback to index.html for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  const base = fs.existsSync(publicDir) ? publicDir : altFrontendDir;
  res.sendFile(path.join(base, 'index.html'));
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`→ Try: http://localhost:${PORT}/`);
  console.log(`→ API: /api/events?month=8&year=1947`);
});
