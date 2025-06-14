require('dotenv').config(); // Para leer el .env
console.log("🔐 Clave Fernet cargada:", process.env.FERNET_KEY);

const express = require('express');
const cors = require('cors');
const app = express();

// 🛠 Middlewares primero
app.use(cors());
app.use(express.json()); // ✅ Esto debe ir antes de las rutas

// 📦 Rutas
const estudianteRoutes = require('./routes/estudianteRoutes');
const loginRoutes = require('./routes/loginRoutes');
const qrRoutes = require('./routes/qrRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');

// 🧭 Montar rutas
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api', qrRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/login', loginRoutes);


// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'No encontrado' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 🚀 Iniciar servidor
app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});