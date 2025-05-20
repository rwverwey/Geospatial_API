const express = require('express');
const router = express.Router();
const {
  fetchGeoDataFromNasa,
  saveGeoData,
  getAllGeoData,
  getGeoDataById,
  deleteGeoDataById
} = require('../controllers/geoController');

const { check, validationResult } = require('express-validator');

// GET from NASA API (with query validation)
router.get(
  '/',
  [
    check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    check('lon').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    check('date').isISO8601().withMessage('Date must be a valid ISO date'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  fetchGeoDataFromNasa
);

// POST to MongoDB (with body validation)
router.post(
  '/',
  [
    check('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    check('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    check('date').isISO8601().withMessage('Date must be a valid ISO date'),
    check('url').isURL().withMessage('URL must be valid'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  saveGeoData
);

// GET all saved entries
router.get('/all', getAllGeoData);

// GET one by ID
router.get('/:id', getGeoDataById);

// DELETE one by ID
router.delete('/:id', deleteGeoDataById);

module.exports = router;
