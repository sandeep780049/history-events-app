const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Load events data
const eventsFilePath = path.join(__dirname, 'data', 'events.json');
const eventsData = JSON.parse(fs.readFileSync(eventsFilePath, 'utf8'));

// ---- EVENTS SEARCH ROUTE ----
// Now uses month OR year matching to show more results
app.get('/api/events/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);

  const filtered = eventsData.filter(
    e => e.month === month || e.year === year
  );

  res.json(filtered);
});

// ---- QUIZ GENERATION ROUTE ----
app.get('/api/events/quiz/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);

  // We use month OR year to get a larger question pool
  const filtered = eventsData.filter(e => e.month === month || e.year === year);

  if (filtered.length < 4) {
    return res.json([]); // Not enough data for a quiz
  }

  // Pick first 5 (or fewer if not available) to make questions
  const quiz = filtered.slice(0, 5).map(ev => {
    const correctYear = ev.year.toString();
    const options = new Set([correctYear]);

    // Generate 3 random incorrect years
    while (options.size < 4) {
      const randomYear = (ev.year - Math.floor(Math.random() * 100) + 1).toString();
      options.add(randomYear);
    }

    return {
      question: `In which year did this happen? — ${ev.event}`,
      options: Array.from(options).sort(),
      answer: correctYear
    };
  });

  res.json(quiz);
});

// ---- QUIZ ANSWER CHECK ROUTE ----
app.post('/api/events/quiz/check', (req, res) => {
  const { answers } = req.body;
  let score = 0;

  const results = answers.map(ans => {
    const qEvent = eventsData.find(e => ans.question.includes(e.event));
    const correct = qEvent ? qEvent.year.toString() : null;
    const isCorrect = ans.selected === correct;
    if (isCorrect) score++;

    return {
      question: ans.question,
      selected: ans.selected,
      correct,
      isCorrect
    };
  });

  res.json({
    score,
    total: answers.length,
    results
  });
});

// ---- DEPLOYMENT CONFIG ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
