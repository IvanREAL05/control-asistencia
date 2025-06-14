require('dotenv').config();
console.log("🔐 Clave Fernet cargada:", process.env.FERNET_KEY)
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // en vez de ../db/conexcion
const fernet = require('fernet');



const fernetKey = new fernet.Secret(process.env.FERNET_KEY);


function obtenerFechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

router.post('/', async (req, res) => {
  console.log('📥 Petición recibida:', req.body);
  const { qr } = req.body;
  

  if (!qr) {
    return res.status(400).json({ success: false, mensaje: 'No se recibió el QR' });
  }
  
  try {
   
    const token = new fernet.Token({
      secret: fernetKey,
      token: qr,
      ttl: 0 // Sin expiración
    });
    const decrypted = token.decode();

    //formato: "NOMBRE COMPLETO|MATRÍCULA|GRUPO|CLAVE_UNICA"
    const partes = decrypted.split('|').map(p => p.trim());
    if (partes.length < 4) {
      return res.status(400).json({ success: false, mensaje: 'Formato QR inválido' });
    }

    const nombreCompleto = partes[0];
    const matricula = partes[1];
    const grupoTexto = partes[2];

    // Buscar estudiante por matrícula
    const estudianteResult = await pool.query(
      'SELECT id_estudiante FROM estudiante WHERE matricula = $1',
      [matricula]
    );

    if (estudianteResult.rowCount === 0) {
      return res.status(404).json({ success: false, mensaje: 'Estudiante no encontrado' });
    }

    const id_estudiante = estudianteResult.rows[0].id_estudiante;

    // Buscar grupo por nombre
    const grupoResult = await pool.query(
      'SELECT id_grupo FROM grupo WHERE nombre = $1',
      [grupoTexto]
    );

    if (grupoResult.rowCount === 0) {
      return res.status(404).json({ success: false, mensaje: 'Grupo no encontrado' });
    }

    const id_grupo = grupoResult.rows[0].id_grupo;

    // Obtener fecha local
    const hoy = obtenerFechaLocal();
    console.log('id_grupo:', id_grupo, 'fecha:', hoy);
    // Buscar clase del grupo para hoy
    const claseResult = await pool.query(
      `SELECT id_clase FROM clase
       WHERE id_grupo = $1 AND fecha = $2
       ORDER BY hora_inicio ASC
       LIMIT 1`,
      [id_grupo, hoy]
    );

    if (claseResult.rowCount === 0) {
      return res.status(404).json({ success: false, mensaje: 'No hay clase hoy para ese grupo' });
    }

    const id_clase = claseResult.rows[0].id_clase;

    // Hora actual en formato HH:MM:SS
    const horaActual = new Date().toTimeString().split(' ')[0];

    // Insertar asistencia
    await pool.query(
      `INSERT INTO asistencia (id_estudiante, id_clase, hora_entrada, estado)
       VALUES ($1, $2, $3, 'presente')`,
      [id_estudiante, id_clase, horaActual]
    );

    res.json({ success: true, mensaje: 'Asistencia registrada correctamente' });

  } catch (error) {
    console.error('❌ Error al registrar asistencia:', error);
    res.status(500).json({ success: false, mensaje: 'Error del servidor' });
  }
});

module.exports = router;