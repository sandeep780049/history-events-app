import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==== 1. Serve events.json at /events ====
app.get('/events', (req, res) => {
  const eventsFile = path.join(__dirname, 'data', 'events.json');
  if (fs.existsSync(eventsFile)) {
    const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
    res.json(events);
  } else {
    res.status(404).json({ error: 'events.json not found' });
  }
});

// ==== 2. Serve frontend files ====
// Try first: ../frontend (outside backend)
const frontendPathOutside = path.join(__dirname, '../frontend');
// Or: ./frontend (inside backend)
const frontendPathInside = path.join(__dirname, 'frontend');

// Pick whichever exists
let frontendPath = frontendPathOutside;
if (!fs.existsSync(frontendPath)) {
  frontendPath = frontendPathInside;
}

app.use(express.static(frontendPath));

// ==== 3. Serve index.html for all other routes ====
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==== 4. Start server ====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📂 Serving frontend from: ${frontendPath}`);
});
