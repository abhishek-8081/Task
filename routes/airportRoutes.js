const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');

// Search endpoints
router.get('/search', airportController.autocomplete);
router.get('/nearby', airportController.nearby);

// Debug endpoint (optional)
router.get('/debug/count', async (req, res) => {
  const count = await Airport.countDocuments();
  res.json({ total_airports: count });
});

module.exports = router;