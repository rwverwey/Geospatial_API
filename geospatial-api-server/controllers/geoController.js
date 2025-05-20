const GeoData = require('../models/GeoData');

// GET /api/geo-data
exports.fetchGeoDataFromNasa = async (req, res) => {
  const { lat, lon, date } = req.query;
  const NASA_API_KEY = process.env.NASA_API_KEY;

  const url = `https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&date=${date}&dim=0.1&api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to fetch from NASA API' });
    }
    const data = await response.json();
    const imageUrl = response.url;

    res.status(200).json({
      imageUrl,
      lat,
      lon,
      date,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching image' });
  }
};

// POST /api/geo-data
exports.saveGeoData = async (req, res) => {
  try {
    const newEntry = await GeoData.create(req.body);
    res.status(201).json({ message: 'Saved', id: newEntry._id });
  } catch (err) {
    console.error('SAVE ERROR:', err.message);
    res.status(500).json({ error: 'Failed to save entry' });
  }
};

// GET /api/geo-data/all (with filters, select, sort, pagination)
exports.getAllGeoData = async (req, res) => {
  const {
    after,
    before,
    latMin,
    latMax,
    lonMin,
    lonMax,
    locationName,
    fields,
    sort,
    limit,
    page,
  } = req.query;

  const filter = {};

  // Date filters
  if (after || before) {
    filter.date = {};
    if (after) filter.date.$gt = new Date(after);
    if (before) filter.date.$lt = new Date(before);
  }

  // Latitude
  if (latMin || latMax) {
    filter.latitude = {};
    if (latMin) filter.latitude.$gte = parseFloat(latMin);
    if (latMax) filter.latitude.$lte = parseFloat(latMax);
  }

  // Longitude
  if (lonMin || lonMax) {
    filter.longitude = {};
    if (lonMin) filter.longitude.$gte = parseFloat(lonMin);
    if (lonMax) filter.longitude.$lte = parseFloat(lonMax);
  }

  // Name search
  if (locationName) {
    filter.locationName = { $regex: new RegExp(locationName, 'i') };
  }

  const selectFields = fields ? fields.split(',').join(' ') : '';
  const sortFields = sort || '';

  const limitNum = parseInt(limit) || 20;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  try {
    const total = await GeoData.countDocuments(filter);

    const results = await GeoData.find(filter)
      .select(selectFields)
      .sort(sortFields)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      results,
    });
  } catch (err) {
    console.error('GET ALL FILTER ERROR:', err.message);
    res.status(500).json({ error: 'Failed to retrieve entries' });
  }
};

// GET /api/geo-data/:id
exports.getGeoDataById = async (req, res) => {
  try {
    const geo = await GeoData.findById(req.params.id);
    if (!geo) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(geo);
  } catch (err) {
    console.error('GET BY ID ERROR:', err.message);
    res.status(500).json({ error: 'Server error retrieving entry' });
  }
};

// DELETE /api/geo-data/:id
exports.deleteGeoDataById = async (req, res) => {
  try {
    const deleted = await GeoData.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
};
