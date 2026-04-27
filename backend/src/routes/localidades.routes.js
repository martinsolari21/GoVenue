const router = require('express').Router();
const prisma = require('../prisma/client');

router.get('/', async (req, res) => {
  const localidades = await prisma.localidad.findMany({ orderBy: { nombre: 'asc' } });
  res.json(localidades);
});

module.exports = router;
