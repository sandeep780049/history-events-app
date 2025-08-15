const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    fs.readFile(path.join(__dirname, '../data/events.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading events file' });

        const events = JSON.parse(data);
        const filtered = events.filter(e => e.month === month && e.year === year);

        res.json(filtered);
    });
});

module.exports = router;
