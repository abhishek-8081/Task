const mongoose = require('mongoose');
const { Schema } = mongoose;

const AirportSchema = new Schema({
  icao: { type: String, unique: true },
  iata: { type: String, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: false },
  country: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

// Create indexes
AirportSchema.index({ location: '2dsphere' });
AirportSchema.index({ name: 'text', city: 'text', country: 'text' });

module.exports = mongoose.model('Airport', AirportSchema);