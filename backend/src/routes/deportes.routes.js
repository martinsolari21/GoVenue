const router = require('express').Router();
const prisma = require('../prisma/client');

router.get('/', async (req, res) => {
  const deportes = await prisma.deporte.findMany({ orderBy: { nombre: 'asc' } });
  res.json(deportes);
});

module.exports = router;
