const mongoose = require('mongoose');
const { Schema } = mongoose;

const AirportSchema = new Schema({
  icao: { type: String, unique: true },
  iata: { type: String, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

// Create geospatial index (critical for nearby searches)
AirportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Airport', AirportSchema);