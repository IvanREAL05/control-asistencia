// backend/routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

require('dotenv').config();

// Configura conexión a PostgreSQL (puedes también usar la que ya tengas)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

router.post('/', async (req, res) => {
  const { usuario_login, contrasena } = req.body;

  if (!usuario_login || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const query = 'SELECT * FROM usuario WHERE usuario_login = $1';
    const result = await pool.query(query, [usuario_login]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', usuario: { id: user.id_usuario, rol: user.rol } });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;