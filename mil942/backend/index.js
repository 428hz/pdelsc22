const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servimos los archivos estáticos de la carpeta 'dist' del frontend.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Ruta "catch-all" con la sintaxis corregida.
// Esto atrapará cualquier petición que no sea un archivo estático.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Iniciamos el servidor.
app.listen(PORT, () => {
  console.log(`¡Servidor de producción listo!`);
  console.log(`Juego disponible en http://localhost:${PORT}`);
});