// server.js

const express = require('express');
// y este es para poder ir a buscar cosas a otras urls
const fetch = require('node-fetch');
// acá creamos la aplicación, el aparato principal
const app = express();
// el puerto donde va a correr todo esto
const port = 3000;

// este aparatito mira cada vez que alguien pide algo y lo muestra en la consola
app.use((req, res, next) => {
  console.log(`[Servidor] Petición recibida: ${req.method} ${req.url}`);
  next();
});

// acá le decimos que la carpeta 'public' tiene los archivos que se pueden ver desde afuera
app.use(express.static('public'));

// acá vamos a guardar los datos de los usuarios cuando los traigamos
let usersData = [];

// esta es la función que va a buscar los datos a la api de afuera
const fetchUsers = async () => {
  try {
    // avisamos que estamos yendo a buscar los datos
    console.log('[Servidor] Obteniendo datos desde jsonplaceholder...');
    // acá es donde efectivamente vamos a la url a buscar el tema
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    // por las dudas, si algo sale mal, avisamos
    if (!response.ok) {
        throw new Error(`Error al contactar la API externa: ${response.statusText}`);
    }
    // si todo joya, guardamos los datos que nos devolvió en formato json
    usersData = await response.json();
    // y avisamos que ya está
    console.log('[Servidor] Datos cargados correctamente');
  } catch (error) {
    // si se rompió todo, agarramos el error acá
    console.error('[Servidor] No se pudieron obtener los datos de la API externa:', error);
    // y bueno, dejamos el coso este vacío 
    usersData = []; 
  }
};

// acá creamos la dirección de nuestra api, la '/api/alumnos'
app.get('/api/alumnos', (req, res) => {
  // avisamos que vamos a mandar la lista
  console.log('[Servidor] Enviando la lista completa de usuarios...');
  // cuando alguien entre a esa dirección, le devolvemos los datos de los usuarios
  res.json(usersData);
});

// acá prendemos el servidor para que se quede escuchando
app.listen(port, () => {
  console.log(`¡Servidor listo! Escuchando en http://localhost:${port}`);
  // y ni bien arranca, llamamos a la función para que vaya a buscar los datos
  fetchUsers();
});