const express = require('express');
const path = require('path');
const eventsRoute = require('./routes/events');
const quizRoute = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend folder as static
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/events', eventsRoute);
app.use('/quiz', quizRoute);

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
