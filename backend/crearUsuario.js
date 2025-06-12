require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function crearUsuario() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  const usuario_login = 'admin01';
  const rol = 'admin';
  const passwordPlano = 'admin123';
  const saltRounds = 10;

  const hash = await bcrypt.hash(passwordPlano, saltRounds);

  const query = `
    INSERT INTO usuario (usuario_login, rol, contrasena)
    VALUES ($1, $2, $3)
    ON CONFLICT (usuario_login) DO UPDATE SET contrasena = EXCLUDED.contrasena
  `;
  await pool.query(query, [usuario_login, rol, hash]);

  console.log('Usuario creado o actualizado');
  await pool.end();
}

crearUsuario().catch(console.error);