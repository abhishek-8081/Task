const express = require('express');
const mongoose = require('mongoose'); // Add this
const app = express();
const Airport = require('./models/Airport');

// ======================
// ADD THESE CRITICAL PARTS
// ======================

// 1. MongoDB Connection (REQUIRED)
mongoose.connect('mongodb://localhost:27017/airport-search', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 2. Body Parser Middleware (Recommended)
app.use(express.json());

// 3. Enable CORS (Recommended)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ======================
// YOUR EXISTING ROUTE
// ======================
app.get('/api/airports/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Airport.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { iata: { $regex: `^${query}`, $options: 'i' } }
      ]
    }).limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// HEALTH CHECK (Recommended)
// ======================
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    db: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});