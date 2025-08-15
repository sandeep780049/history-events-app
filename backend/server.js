const express = require('express');
const path = require('path');

const eventsRoute = require('./routes/events');
const quizRoute = require('./routes/quiz'); // ✅ require first

const app = express(); // ✅ initialize app before using it

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Use routes
app.use('/events', eventsRoute);
app.use('/quiz', quizRoute); // ✅ now safe to use

// Fallback for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
