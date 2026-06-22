const router = require('express').Router();
const prisma = require('../prisma/client');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', async (req, res) => {
  const { deporte, localidad, fecha, q } = req.query;
  const where = { estado: 'PUBLICADO' };
  if (deporte) where.deporteId = Number(deporte);
  if (localidad) where.venue = { localidadId: Number(localidad) };
  if (fecha) {
    const d = new Date(fecha);
    where.fecha = { gte: d, lt: new Date(d.getTime() + 86400000) };
  }
  if (q) where.OR = [
    { titulo: { contains: q, mode: 'insensitive' } },
    { descripcion: { contains: q, mode: 'insensitive' } },
  ];
  try {
    const eventos = await prisma.evento.findMany({
      where,
      include: {
        deporte: true,
        venue: { include: { localidad: true } },
        organizador: { select: { id: true, nombre: true } },
        _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } },
      },
      orderBy: { fecha: 'asc' },
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

router.get('/organizador/mis-eventos', verificarToken, async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      where: { organizadorId: req.organizador.id },
      include: {
        deporte: true,
        venue: { include: { localidad: true } },
        _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        deporte: true,
        venue: { include: { localidad: true } },
        organizador: { select: { id: true, nombre: true } },
        _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } },
      },
    });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    await prisma.evento.update({ where: { id: Number(req.params.id) }, data: { vistas: { increment: 1 } } });
    res.json({ ...evento, vistas: (evento.vistas || 0) + 1 });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

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

router.patch('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    if (evento.organizadorId !== req.organizador.id) return res.status(403).json({ error: 'Sin permiso' });
    const { titulo, descripcion, fecha, horaInicio, horaFin, cupos, precio, estado } = req.body;
    const data = {};
    if (titulo) data.titulo = titulo;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (fecha) data.fecha = new Date(fecha);
    if (horaInicio) data.horaInicio = horaInicio;
    if (horaFin) data.horaFin = horaFin;
    if (cupos) data.cupos = Number(cupos);
    if (precio !== undefined) data.precio = precio ? Number(precio) : null;
    if (estado) data.estado = estado;
    const actualizado = await prisma.evento.update({
      where: { id },
      data,
      include: { deporte: true, venue: { include: { localidad: true } }, _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } } },
    });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

module.exports = router;
