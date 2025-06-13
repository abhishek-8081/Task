exports.autocomplete = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    // Flexible search across multiple fields
    const results = await Airport.find({
      $or: [
        { city: { $regex: query, $options: 'i' } }, // Case-insensitive city search
        { iata: { $regex: `^${query}$`, $options: 'i' } }, // Exact IATA code match
        { name: { $regex: query, $options: 'i' } } // Airport name search
      ]
    })
    .limit(10)
    .select('_id name city country iata icao location'); // Only return essential fields

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};