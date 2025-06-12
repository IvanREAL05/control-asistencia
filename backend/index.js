const express = require('express');
const cors = require('cors');
const app = express();
const estudianteRoutes = require('./routes/estudianteRoutes');
const loginRoutes = require('./routes/loginRoutes'); // <-- importar aquí

app.use(cors());
app.use(express.json());

app.use('/api/estudiante', estudianteRoutes);
app.use('/api/login', loginRoutes); // <-- montar ruta login

app.listen(3001, () => {
  console.log('Backend corriendo en http://localhost:3001');
});