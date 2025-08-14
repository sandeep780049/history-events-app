const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve events.json from backend/data
app.use('/data', express.static(path.join(__dirname, 'data')));

// Fallback to index.html for any unknown route (single-page app handling)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
