require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/venues', require('./routes/venues.routes'));
app.use('/api/eventos', require('./routes/eventos.routes'));
app.use('/api/deportes', require('./routes/deportes.routes'));
app.use('/api/localidades', require('./routes/localidades.routes'));
app.use('/api/organizadores', require('./routes/organizadores.routes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'GoVenue API', env: process.env.NODE_ENV });
});

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GoVenue API corriendo en puerto ${PORT}`));
