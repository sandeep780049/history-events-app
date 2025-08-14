const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());

const eventsData = JSON.parse(fs.readFileSync('./data/events.json', 'utf8'));

// Search events by month/year
app.get('/api/events/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);
  const filtered = eventsData.filter(e => e.month === month && e.year === year);
  res.json(filtered);
});

// Generate quiz questions
app.get('/api/events/quiz/:month/:year', (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);
  const filtered = eventsData.filter(e => e.month === month || e.year === year);

  if (filtered.length < 4) {
    return res.json([]); // not enough data for quiz
  }

  const quiz = filtered.slice(0, 5).map(ev => {
    const correctYear = ev.year.toString();
    const options = new Set([correctYear]);
    while (options.size < 4) {
      options.add((correctYear - Math.floor(Math.random() * 100) + 1).toString());
    }
    return {
      question: `In which year did this happen? — ${ev.event}`,
      options: Array.from(options).sort(),
      answer: correctYear
    };
  });

  res.json(quiz);
});

// Check quiz answers
app.post('/api/events/quiz/check', (req, res) => {
  const { answers } = req.body; // [{question, selected}]
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
  res.json({ score, total: answers.length, results });
});

app.listen(3000, () => console.log('Server running on port 3000'));
