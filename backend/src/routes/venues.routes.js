const router = require('express').Router();
const prisma = require('../prisma/client');
const { verificarToken } = require('../middlewares/auth.middleware');

// GET /api/venues — público
router.get('/', async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      include: { localidad: true },
      orderBy: { nombre: 'asc' },
    });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener venues' });
  }
});

// POST /api/venues — protegido
router.post('/', verificarToken, async (req, res) => {
  const { nombre, direccion, localidadId } = req.body;
  if (!nombre || !direccion || !localidadId)
    return res.status(400).json({ error: 'nombre, direccion y localidadId son obligatorios' });
  try {
    const venue = await prisma.venue.create({
      data: { nombre, direccion, localidadId: Number(localidadId) },
      include: { localidad: true },
    });
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear venue' });
  }
});

module.exports = router;
