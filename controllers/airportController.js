exports.autocomplete = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Minimum 2 characters required',
        example: 'Try: /api/airports/search?query=del'
      });
    }

    const searchQuery = query.trim().toLowerCase();

    const results = await Airport.aggregate([
      {
        $match: {
          $or: [
            { city: { $regex: searchQuery, $options: 'i' } },
            { iata: { $regex: `^${searchQuery}$`, $options: 'i' } },
            { name: { $regex: searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' } }
          ]
        }
      },
      {
        $addFields: {
          matchType: {
            $cond: [
              { $regexMatch: { input: "$iata", regex: `^${searchQuery}$`, options: "i" } },
              "iata",
              {
                $cond: [
                  { $regexMatch: { input: "$city", regex: searchQuery, options: "i" } },
                  "city",
                  "name"
                ]
              }
            ]
          }
        }
      },
      { $sort: { matchType: 1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          country: 1,
          iata: 1,
          icao: 1,
          matchType: 1
        }
      }
    ]);

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No airports found',
        suggestions: [
          'Check your spelling',
          'Try: DEL, Mumbai, or Indira Gandhi'
        ]
      });
    }

    res.json({
      count: results.length,
      query: searchQuery,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};