const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
    const quizFilePath = path.join(__dirname, '../data/quiz.json');

    fs.readFile(quizFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading quiz.json:', err);
            return res.status(500).json({ error: 'Error loading quiz data' });
        }

        try {
            const allQuestions = JSON.parse(data);

            // Pick 5 random questions
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            res.json(selected);
        } catch (parseErr) {
            console.error('Error parsing quiz.json:', parseErr);
            res.status(500).json({ error: 'Invalid quiz data format' });
        }
    });
});

module.exports = router;
