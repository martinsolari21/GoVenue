const router = require('express').Router();
const prisma = require('../prisma/client');
const { verificarToken } = require('../middlewares/auth.middleware');

// GET /api/eventos — público, con filtros opcionales
router.get('/', async (req, res) => {
  const { deporte, localidad, fecha } = req.query;
  const where = { estado: 'PUBLICADO' };

  if (deporte) where.deporteId = Number(deporte);
  if (localidad) where.venue = { localidadId: Number(localidad) };
  if (fecha) {
    const d = new Date(fecha);
    where.fecha = { gte: d, lt: new Date(d.getTime() + 86400000) };
  }

  try {
    const eventos = await prisma.evento.findMany({
      where,
      include: { deporte: true, venue: { include: { localidad: true } }, organizador: { select: { nombre: true } } },
      orderBy: { fecha: 'asc' },
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// GET /api/eventos/:id — público
router.get('/:id', async (req, res) => {
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: Number(req.params.id) },
      include: { deporte: true, venue: { include: { localidad: true } }, organizador: { select: { nombre: true } } },
    });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

// GET /api/eventos/mis-eventos — organizador autenticado
router.get('/organizador/mis-eventos', verificarToken, async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      where: { organizadorId: req.organizador.id },
      include: { deporte: true, venue: { include: { localidad: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// POST /api/eventos — organizador autenticado
router.post('/', verificarToken, async (req, res) => {
  const { titulo, descripcion, fecha, horaInicio, horaFin, cupos, precio, deporteId, venueId } = req.body;
  if (!titulo || !fecha || !horaInicio || !horaFin || !cupos || !deporteId || !venueId)
    return res.status(400).json({ error: 'Campos obligatorios incompletos' });

  try {
    const evento = await prisma.evento.create({
      data: {
        titulo, descripcion,
        fecha: new Date(fecha),
        horaInicio, horaFin,
        cupos: Number(cupos),
        precio: precio ? Number(precio) : null,
        deporteId: Number(deporteId),
        venueId: Number(venueId),
        organizadorId: req.organizador.id,
      },
      include: { deporte: true, venue: { include: { localidad: true } } },
    });
    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// PATCH /api/eventos/:id — organizador autenticado, solo su evento
router.patch('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    if (evento.organizadorId !== req.organizador.id)
      return res.status(403).json({ error: 'No tenés permiso para editar este evento' });

    const actualizado = await prisma.evento.update({
      where: { id },
      data: req.body,
      include: { deporte: true, venue: { include: { localidad: true } } },
    });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

module.exports = router;
