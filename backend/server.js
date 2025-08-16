const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/ping", (req, res) => {
  res.json({ message: "Server is live ✅" });
});
// Route to fetch historical events from external API
app.get("/events", async (req, res) => {
  try {
    const { month, day } = req.query;

    if (!month || !day) {
      return res.status(400).json({ error: "Month and day required" });
    }

    // External API: Numbers API (http://numbersapi.com)
    const url = `http://numbersapi.com/${month}/${day}/date?json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch external API");

    const data = await response.json();

    res.json({
      events: [data.text], // always returns one fact
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load events" });
  }
});

// Quiz route (static for now)
app.get("/quiz", (req, res) => {
  const quiz = [
    {
      question: "Who was the first President of India?",
      options: ["Rajendra Prasad", "Jawaharlal Nehru", "S. Radhakrishnan", "Mahatma Gandhi"],
      answer: "Rajendra Prasad",
    },
    {
      question: "When did India gain independence?",
      options: ["1945", "1947", "1950", "1962"],
      answer: "1947",
    },
    {
      question: "Who wrote the Arthashastra?",
      options: ["Kautilya", "Kalidasa", "Valmiki", "Chanakya"],
      answer: "Kautilya",
    },
    {
      question: "The Quit India Movement was launched in?",
      options: ["1935", "1940", "1942", "1945"],
      answer: "1942",
    },
    {
      question: "Who was the founder of the Maurya Empire?",
      options: ["Ashoka", "Bindusara", "Chandragupta Maurya", "Harsha"],
      answer: "Chandragupta Maurya",
    },
  ];

  res.json(quiz);
});

// Serve frontend for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
