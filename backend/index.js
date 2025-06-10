// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const estudianteRoutes = require('./routes/estudianteRoutes');

app.use(cors());
app.use(express.json());

// Montar la ruta: /api/estudiante
app.use('/api/estudiante', estudianteRoutes);

app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});