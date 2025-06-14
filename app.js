const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Airport = require("./models/Airport");

mongoose
  .connect("mongodb://localhost:27017/airport-search")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/api/airports/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ error: "Query parameter required" });

    const results = await Airport.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { iata: { $regex: `^${query}`, $options: "i" } },
      ],
    }).limit(10);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/airports/nearby", async (req, res) => {
  try {
    const { lat, lon, radius = 100 } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

 
    const airports = await Airport.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          distanceField: "distance",
          maxDistance: radius * 1000, 
          spherical: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          country: 1,
          iata: 1,
          icao: 1,
          distance: { $divide: ["$distance", 1000] }, 
        },
      },
      { $limit: 10 },
    ]);

    res.json(airports);
  } catch (err) {
    console.error("Nearby search error:", err);
    res.status(500).json({ error: "Failed to find nearby airports" });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
