// backend/server.js
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Route to fetch events for a given day + month
app.get("/events/:month/:day", async (req, res) => {
  const { month, day } = req.params;

  try {
    const response = await axios.get(
      `https://byabbe.se/on-this-day/${month}/${day}/events.json`
    );

    res.json(response.data.events); // send only events array
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Health check
app.get("/ping", (req, res) => {
  res.json({ message: "Server is live ✅" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
