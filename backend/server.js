const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Load events.json
const eventsPath = path.join(__dirname, 'data', 'events.json');
let events = [];
if (fs.existsSync(eventsPath)) {
  events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
} else {
  console.error("❌ events.json not found at", eventsPath);
}

// Serve frontend
const frontendDir = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
}

// API endpoint for events
app.get('/api/events', (req, res) => {
  let { month, year } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }

  month = parseInt(month, 10);
  year = year ? parseInt(year, 10) : null;

  // Filter by month, and year only if provided
  let filtered = events.filter(e => parseInt(e.month, 10) === month);
  if (year) {
    filtered = filtered.filter(e => parseInt(e.year, 10) === year);
  }

  res.json(filtered);
});

// Fallback to index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
