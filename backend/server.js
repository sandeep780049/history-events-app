const express = require('express');
const path = require('path');

const eventsRoute = require('./routes/events');
const quizRoute = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 3000;
const quizRoute = require('./routes/quiz');
app.use('/quiz', quizRoute);
// Middleware
app.use(express.json());

// API Routes
app.use('/events', eventsRoute);
app.use('/quiz', quizRoute);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
