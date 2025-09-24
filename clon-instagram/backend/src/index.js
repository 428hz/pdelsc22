import app from './app.js';
import 'dotenv/config';
import pool from './config/database.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});