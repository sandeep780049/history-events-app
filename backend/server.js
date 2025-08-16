const express = require('express');
const fetch = require('node-fetch'); // if Node v18+, remove this and use built-in fetch
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Route: fetch events from external API
app.get('/events/:month/:day', async (req, res) => {
  const { month, day } = req.params;
  try {
    const response = await fetch(`https://byabbe.se/on-this-day/${month}/${day}/events.json`);
    const data = await response.json();
    res.json(data.events); // send only events
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Quiz route: returns 5 random Qs
const quizPool = [
  {
    question: "Who was the first President of India?",
    options: ["Dr. Rajendra Prasad", "Mahatma Gandhi", "Jawaharlal Nehru", "B. R. Ambedkar"],
    answer: "Dr. Rajendra Prasad"
  },
  {
    question: "In which year did the Revolt of 1857 take place?",
    options: ["1857", "1869", "1848", "1872"],
    answer: "1857"
  },
  {
    question: "Who is known as the Iron Man of India?",
    options: ["Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Bhagat Singh", "Jawaharlal Nehru"],
    answer: "Sardar Vallabhbhai Patel"
  },
  {
    question: "When was the Constitution of India adopted?",
    options: ["1947", "1949", "1950", "1952"],
    answer: "1949"
  },
  {
    question: "Who founded the Maurya Empire?",
    options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Bimbisara"],
    answer: "Chandragupta Maurya"
  },
  {
    question: "Who gave the slogan 'Inquilab Zindabad'?",
    options: ["Bhagat Singh", "Subhas Chandra Bose", "Mahatma Gandhi", "Bal Gangadhar Tilak"],
    answer: "Bhagat Singh"
  },
  {
    question: "Which movement was launched in 1942?",
    options: ["Quit India Movement", "Civil Disobedience", "Non-Cooperation", "Swadeshi"],
    answer: "Quit India Movement"
  }
];

app.get('/quiz', (req, res) => {
  let shuffled = quizPool.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 5));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
