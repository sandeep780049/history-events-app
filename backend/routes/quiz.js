const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '../data/quiz.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading quiz file' });

        let quiz = JSON.parse(data);

        // Shuffle and pick 5 random questions
        quiz = quiz.sort(() => 0.5 - Math.random()).slice(0, 5);

        res.json(quiz);
    });
});

module.exports = router;
