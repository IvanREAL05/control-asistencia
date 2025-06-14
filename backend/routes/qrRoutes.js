const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { decryptQR } = require('../utils/fernet'); // Asegúrate de tener esto

// POST /api/asistencia
router.post('/asistencia', async (req, res) => {
  try {
    console.log("Cuerpo recibido:", req.body);
    const { qrData } = req.body;

    // Desencriptar el contenido del QR
    const textoPlano = decryptQR(qrData); // Formato esperado: NOMBRE | MATRICULA | GRUPO | CLAVE
    const [nombreCompleto, matricula, grupo, claveUnica] = textoPlano.split('|').map(s => s.trim());

    // Buscar estudiante por matrícula
    const estudianteResult = await pool.query('SELECT id FROM estudiante WHERE matricula = $1', [matricula]);

    if (estudianteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const id_estudiante = estudianteResult.rows[0].id;

    // Registrar asistencia
    const insertQuery = `
      INSERT INTO asistencia (id_estudiante, id_clase, estado, fecha)
      VALUES ($1, $2, 'Presente', CURRENT_DATE)
    `;
    await pool.query(insertQuery, [id_estudiante, id_clase]);

    res.json({ success: true, message: 'Asistencia registrada correctamente' });

  } catch (err) {
    console.error('Error en /api/asistencia:', err);
    res.status(500).json({ error: 'Error al procesar el QR' });
  }
});

module.exports = router;