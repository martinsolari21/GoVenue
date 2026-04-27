require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/venues', require('./routes/venues.routes'));
app.use('/api/eventos', require('./routes/eventos.routes'));
app.use('/api/deportes', require('./routes/deportes.routes'));
app.use('/api/localidades', require('./routes/localidades.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'GoVenue API', env: process.env.NODE_ENV });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 GoVenue API corriendo en puerto ${PORT}`);
});
