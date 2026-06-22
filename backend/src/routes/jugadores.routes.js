const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const verificarJugador = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.rol !== 'jugador') return res.status(403).json({ error: 'Acceso denegado' });
    req.jugador = payload;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// POST /api/jugadores/register
router.post('/register', async (req, res) => {
  const { nombre, email, password, telefono, ciudad, provincia } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
  if (password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  try {
    // Verificar que no exista ni como jugador ni como organizador
    const [jugadorExiste, orgExiste] = await Promise.all([
      prisma.jugador.findUnique({ where: { email } }),
      prisma.organizador.findUnique({ where: { email } }),
    ]);
    if (jugadorExiste || orgExiste)
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });

    const hash = await bcrypt.hash(password, 10);
    const jugador = await prisma.jugador.create({
      data: { nombre, email, password: hash, telefono, ciudad, provincia },
      select: { id: true, nombre: true, email: true, ciudad: true, provincia: true, createdAt: true },
    });

    const token = jwt.sign({ id: jugador.id, email, rol: 'jugador' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ jugador, token, rol: 'jugador' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar jugador' });
  }
});

// POST /api/jugadores/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const jugador = await prisma.jugador.findUnique({ where: { email } });
    if (!jugador) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valido = await bcrypt.compare(password, jugador.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: jugador.id, email, rol: 'jugador' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      jugador: { id: jugador.id, nombre: jugador.nombre, email, ciudad: jugador.ciudad, provincia: jugador.provincia },
      token,
      rol: 'jugador',
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// GET /api/jugadores/mis-inscripciones
router.get('/mis-inscripciones', verificarJugador, async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { jugadorId: req.jugador.id },
      include: {
        evento: {
          include: {
            deporte: true,
            venue: { include: { localidad: true } },
            organizador: { select: { nombre: true } },
            _count: { select: { inscripciones: { where: { estado: 'INSCRIPTO' } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(inscripciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

module.exports = { router, verificarJugador };
