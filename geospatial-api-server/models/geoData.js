const mongoose = require('mongoose');

const GeoDataSchema = new mongoose.Schema({
  locationName: String,
  latitude: Number,
  longitude: Number,
  date: String,
  url: String,
  type: String,
  service_version: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeoData', GeoDataSchema);
