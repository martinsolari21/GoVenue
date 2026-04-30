const router = require('express').Router();
const prisma = require('../prisma/client');

// GET /api/organizadores/:id — perfil público
router.get('/:id', async (req, res) => {
  try {
    const organizador = await prisma.organizador.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, nombre: true, createdAt: true },
    });
    if (!organizador) return res.status(404).json({ error: 'Organizador no encontrado' });

    const eventos = await prisma.evento.findMany({
      where: { organizadorId: organizador.id, estado: 'PUBLICADO' },
      include: { deporte: true, venue: { include: { localidad: true } } },
      orderBy: { fecha: 'asc' },
    });

    res.json({ organizador, eventos });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

module.exports = router;
