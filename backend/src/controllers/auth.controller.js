const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  try {
    const existe = await prisma.organizador.findUnique({ where: { email } });
    if (existe) return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const organizador = await prisma.organizador.create({
      data: { nombre, email, password: hash },
      select: { id: true, nombre: true, email: true, createdAt: true },
    });

    const token = jwt.sign({ id: organizador.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ organizador, token });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar organizador' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const organizador = await prisma.organizador.findUnique({ where: { email } });
    if (!organizador) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valido = await bcrypt.compare(password, organizador.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: organizador.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      organizador: { id: organizador.id, nombre: organizador.nombre, email },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { registrar, login };
