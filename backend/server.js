// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Path to events.json
const eventsPath = path.join(__dirname, 'backend', 'data', 'events.json');
let events = [];
try {
  events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
} catch (err) {
  console.error('Error reading events.json:', err.message);
}

// Serve frontend (supports backend/frontend layout)
const frontendDir = path.join(__dirname, 'frontend');
const backendFrontendDir = path.join(__dirname, 'backend', 'frontend');

if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
} else if (fs.existsSync(backendFrontendDir)) {
  app.use(express.static(backendFrontendDir));
}

// API: Get events by month/year
app.get('/api/events', (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  const filteredEvents = events.filter(e => 
    e.month === parseInt(month) && e.year === parseInt(year)
  );
  res.json(filteredEvents);
});

// API: Quiz feature
app.post('/api/quiz', (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  const filteredEvents = events.filter(e => 
    e.month === parseInt(month) && e.year === parseInt(year)
  );

  if (filteredEvents.length === 0) {
    return res.json({ question: null, answer: null });
  }

  const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
  res.json({
    question: `In which year did this happen: "${randomEvent.event}"?`,
    answer: randomEvent.year
  });
});

// Fallback to index.html for frontend routes
app.get(/^(?!\/api).*/, (req, res) => {
  const base = fs.existsSync(frontendDir) ? frontendDir : backendFrontendDir;
  res.sendFile(path.join(base, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
