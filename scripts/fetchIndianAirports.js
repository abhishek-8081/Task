require("dotenv").config();
const mongoose = require("mongoose");
const Airport = require("../models/Airport");

const indianAirports = [
  {
    icao: "VIDP",
    iata: "DEL",
    name: "Indira Gandhi International Airport",
    city: "Delhi",
    country: "India",
    location: { type: "Point", coordinates: [77.1031, 28.5562] },
  },
  {
    icao: "VABB",
    iata: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    country: "India",
    location: { type: "Point", coordinates: [72.8679, 19.0887] },
  },
  {
    icao: "VOMM",
    iata: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    country: "India",
    location: { type: "Point", coordinates: [80.1699, 12.9941] },
  },
  {
    icao: "VOBL",
    iata: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    country: "India",
    location: { type: "Point", coordinates: [77.7069, 13.1986] },
  },
  {
    icao: "VOHY",
    iata: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    country: "India",
    location: { type: "Point", coordinates: [78.4298, 17.2403] },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/airport-search");
    await Airport.deleteMany({});
    await Airport.insertMany(indianAirports);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
