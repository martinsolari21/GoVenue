const router = require('express').Router();
const prisma = require('../prisma/client');
const { verificarJugador } = require('./jugadores.routes');

// POST /api/inscripciones — inscribirse a un evento
router.post('/', verificarJugador, async (req, res) => {
  const { eventoId } = req.body;
  if (!eventoId) return res.status(400).json({ error: 'eventoId es requerido' });

  try {
    const evento = await prisma.evento.findUnique({
      where: { id: Number(eventoId) },
      include: { _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } } },
    });

    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    if (evento.estado !== 'PUBLICADO') return res.status(400).json({ error: 'El evento no está disponible' });

    const cuposOcupados = evento._count.inscripciones;
    const hayLugar = cuposOcupados < evento.cupos;

    // Verificar si ya está inscripto
    const yaInscripto = await prisma.inscripcion.findUnique({
      where: { eventoId_jugadorId: { eventoId: Number(eventoId), jugadorId: req.jugador.id } },
    });

    if (yaInscripto) {
      if (yaInscripto.estado === 'INSCRIPTO') return res.status(409).json({ error: 'Ya estás inscripto en este evento' });
      if (yaInscripto.estado === 'LISTA_ESPERA') return res.status(409).json({ error: 'Ya estás en lista de espera' });
      // Si canceló antes, puede reinscribirse
      const reinscripto = await prisma.inscripcion.update({
        where: { id: yaInscripto.id },
        data: { estado: hayLugar ? 'INSCRIPTO' : 'LISTA_ESPERA', createdAt: new Date() },
      });
      return res.json({ inscripcion: reinscripto, estado: reinscripto.estado });
    }

    const inscripcion = await prisma.inscripcion.create({
      data: {
        eventoId: Number(eventoId),
        jugadorId: req.jugador.id,
        estado: hayLugar ? 'INSCRIPTO' : 'LISTA_ESPERA',
      },
    });

    res.status(201).json({ inscripcion, estado: inscripcion.estado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al inscribirse' });
  }
});

// DELETE /api/inscripciones/:eventoId — cancelar inscripción
router.delete('/:eventoId', verificarJugador, async (req, res) => {
  try {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        eventoId_jugadorId: {
          eventoId: Number(req.params.eventoId),
          jugadorId: req.jugador.id,
        },
      },
    });

    if (!inscripcion) return res.status(404).json({ error: 'No estás inscripto en este evento' });
    if (inscripcion.estado === 'CANCELADO') return res.status(400).json({ error: 'Ya cancelaste esta inscripción' });

    await prisma.inscripcion.update({
      where: { id: inscripcion.id },
      data: { estado: 'CANCELADO' },
    });

    // Promover primer jugador en lista de espera si había lugar
    if (inscripcion.estado === 'INSCRIPTO') {
      const siguiente = await prisma.inscripcion.findFirst({
        where: { eventoId: Number(req.params.eventoId), estado: 'LISTA_ESPERA' },
        orderBy: { createdAt: 'asc' },
      });
      if (siguiente) {
        await prisma.inscripcion.update({
          where: { id: siguiente.id },
          data: { estado: 'INSCRIPTO' },
        });
      }
    }

    res.json({ mensaje: 'Inscripción cancelada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cancelar inscripción' });
  }
});

// GET /api/inscripciones/evento/:eventoId — inscriptos de un evento (para el organizador)
router.get('/evento/:eventoId', async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { eventoId: Number(req.params.eventoId), estado: 'INSCRIPTO' },
      include: { jugador: { select: { nombre: true, email: true, telefono: true } } },
      orderBy: { createdAt: 'asc' },
    });
    const listaEspera = await prisma.inscripcion.findMany({
      where: { eventoId: Number(req.params.eventoId), estado: 'LISTA_ESPERA' },
      include: { jugador: { select: { nombre: true, email: true, telefono: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ inscriptos: inscripciones, listaEspera });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inscriptos' });
  }
});

module.exports = router;
