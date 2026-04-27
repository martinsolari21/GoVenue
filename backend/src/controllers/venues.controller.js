const { readVenues, writeVenues } = require('../data/venues.store');

/**
 * GET /api/venues
 * Lista solo venues activos
 */
const getAllVenues = (req, res) => {
  const venues = readVenues();
  res.json(venues.filter(v => v.is_active));
};

/**
 * GET /api/venues/:id
 */
const getVenueById = (req, res) => {
  const venues = readVenues();
  const id = Number(req.params.id);

  const venue = venues.find(v => v.id === id && v.is_active);

  if (!venue) {
    return res.status(404).json({ message: 'Venue no encontrado' });
  }

  res.json(venue);
};

/**
 * GET /api/venues/search
 */
const searchVenues = (req, res) => {
  const venues = readVenues();

  const city = (req.query.city || '').toLowerCase().trim();
  const sport = (req.query.sport || '').toLowerCase().trim();

  let results = venues.filter(v => v.is_active);

  if (city) {
    results = results.filter(v =>
      (v.city || '').toLowerCase().includes(city)
    );
  }

  if (sport) {
    results = results.filter(v =>
      (v.sport || '').toLowerCase().includes(sport)
    );
  }

  res.json(results);
};

/**
 * POST /api/venues
 */
const createVenue = (req, res) => {
  const venues = readVenues();
  const { name, sport, city, address, description } = req.body;

  if (!name || !sport || !city) {
    return res.status(400).json({
      message: 'Faltan campos obligatorios: name, sport, city'
    });
  }

  const newId = venues.length
    ? Math.max(...venues.map(v => v.id)) + 1
    : 1;

  const newVenue = {
    id: newId,
    name,
    sport,
    city,
    address: address || '',
    description: description || '',
    is_active: true
  };

  venues.push(newVenue);
  writeVenues(venues);

  res.status(201).json(newVenue);
};

/**
 * PUT /api/venues/:id
 */
const updateVenue = (req, res) => {
  const venues = readVenues();
  const id = Number(req.params.id);

  const venue = venues.find(v => v.id === id);

  if (!venue) {
    return res.status(404).json({ message: 'Venue no encontrado' });
  }

  const { name, sport, city, address, description, is_active } = req.body;

  if (name !== undefined) venue.name = name;
  if (sport !== undefined) venue.sport = sport;
  if (city !== undefined) venue.city = city;
  if (address !== undefined) venue.address = address;
  if (description !== undefined) venue.description = description;
  if (is_active !== undefined) venue.is_active = is_active;

  writeVenues(venues);
  res.json(venue);
};

/**
 * DELETE /api/venues/:id
 * Borrado lógico
 */
const deleteVenue = (req, res) => {
  const venues = readVenues();
  const id = Number(req.params.id);

  const venue = venues.find(v => v.id === id);

  if (!venue) {
    return res.status(404).json({ message: 'Venue no encontrado' });
  }

  venue.is_active = false;
  writeVenues(venues);

  res.json({
    message: 'Venue desactivado',
    venue
  });
};

module.exports = {
  getAllVenues,
  getVenueById,
  searchVenues,
  createVenue,
  updateVenue,
  deleteVenue
};
