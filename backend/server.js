require('dotenv').config();
const app = require('./src');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ GoVenue API corriendo en http://localhost:${PORT}`);
});
