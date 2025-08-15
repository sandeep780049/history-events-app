const express = require('express');
const path = require('path');

const eventsRoute = require('./routes/events');
const quizRoute = require('./routes/quiz'); // for quiz questions

const app = express();
app.use(express.json());

// ✅ Serve frontend from the folder outside backend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ API routes
app.use('/events', eventsRoute);
app.use('/quiz', quizRoute);

// ✅ Fallback to index.html for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
