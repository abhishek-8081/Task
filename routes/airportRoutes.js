const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');
const Airport = require('../models/Airport');


router.get('/', (req, res) => {
  res.json({
    endpoints: [
      {
        method: 'GET',
        path: '/search',
        description: 'Search airports by name, city or IATA code',
        example: '/api/airports/search?query=del'
      },
      {
        method: 'GET',
        path: '/nearby',
        description: 'Find nearby airports by coordinates',
        example: '/api/airports/nearby?lat=28.61&lon=77.10&radius=50'
      },
      {
        method: 'GET',
        path: '/debug/count',
        description: 'Get total airports count (dev only)'
      }
    ]
  });
});


router.get('/search', airportController.autocomplete);
router.get('/nearby', airportController.nearby);


if (process.env.NODE_ENV === 'development') {
  router.get('/debug/count', async (req, res) => {
    try {
      const count = await Airport.countDocuments();
      res.json({ 
        total_airports: count,
        last_updated: new Date() 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/debug/sample', async (req, res) => {
    const sample = await Airport.aggregate([{ $sample: { size: 5 } }]);
    res.json(sample);
  });
}


router.get('/health', async (req, res) => {
  try {
    await Airport.findOne();
    res.json({ 
      status: 'healthy',
      db_connection: 'active',
      timestamp: new Date() 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: err.message 
    });
  }
});

module.exports = router;