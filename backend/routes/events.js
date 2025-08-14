const express = require("express");
const router = express.Router();
const eventsData = require("../data/events.json");

// Get events for specific month and year
router.get("/:month/:year", (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);

  const filteredEvents = eventsData.filter(
    ev => ev.month === month && ev.year === year
  );

  res.json(filteredEvents);
});

// Get quiz for specific month/year
router.get("/quiz/:month/:year", (req, res) => {
  const month = parseInt(req.params.month);
  const year = parseInt(req.params.year);

  const filteredEvents = eventsData.filter(
    ev => ev.month === month && ev.year === year
  );

  if (filteredEvents.length === 0) {
    return res.json({ message: "No events found for this period." });
  }

  // Create quiz: event descriptions as questions
  const quiz = filteredEvents.map(ev => {
    const correctAnswer = ev.date || `${month}/${year}`;
    return {
      question: `When did this happen: "${ev.event}"?`,
      options: generateOptions(correctAnswer, month, year),
      answer: correctAnswer
    };
  });

  res.json(quiz);
});

function generateOptions(correct, month, year) {
  const options = [correct];
  while (options.length < 4) {
    const randYear = year + Math.floor(Math.random() * 50) - 25;
    const randMonth = month;
    const fakeDate = `${randYear}-${String(randMonth).padStart(2, "0")}-01`;
    if (!options.includes(fakeDate)) {
      options.push(fakeDate);
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

module.exports = router;
