const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve data folder
app.use('/data', express.static(path.join(__dirname, 'data')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
