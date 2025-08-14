const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load events
const events = require(path.join(__dirname, 'data', 'events.json'));

app.use(express.json());

// Serve frontend from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API to get events by month and year
app.get('/api/events', (req, res) => {
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  const filteredEvents = events.filter(e => e.month === month && e.year === year);
  res.json(filteredEvents);
});

// API to get quiz questions
app.get('/api/quiz', (req, res) => {
  const month = parseInt(req.query.month);
  const year = parseInt(req.query.year);

  let filteredEvents = events;
  if (month) filteredEvents = filteredEvents.filter(e => e.month === month);
  if (year) filteredEvents = filteredEvents.filter(e => e.year === year);

  const quiz = filteredEvents.slice(0, 5).map(e => ({
    question: `In which year did this event occur? "${e.event}"`,
    options: [
      e.year,
      e.year + 1,
      e.year - 1,
      e.year + 2
    ].sort(() => Math.random() - 0.5),
    correctAnswer: e.year
  }));

  res.json(quiz);
});

// Always send index.html for any non-API route (for frontend routing support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
