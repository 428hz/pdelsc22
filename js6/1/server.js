// acá traemos el coso de express para montar el servidor
const express = require('express');
// y acá el axios, que es para ir a buscar cosas a otras urls
const axios = require('axios'); 
// con esto creamos la aplicación, el aparato en sí
const app = express();
// el puerto donde va a correr todo eso
const PORT = 3000;

// acá le decimos que la carpeta 'public' tiene los archivos que se pueden ver desde afuera
app.use(express.static('public'));

// cuando alguien entre a '/api/users', hacemos todo lo de acá adentro
app.get('/api/users', async (req, res) => {
  try {
    // esta es la dirección de donde sacamos los datos
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';

    console.log('---------------------------------');
    // avisamos en la consolla del servidor que arrancamos a buscar
    console.log('recibida petición del cliente, buscando datos en la api externa...');

    // con el axios vamos a esa direcciónn y esperamos la respuesta
    const response = await axios.get(apiUrl);
    // de la respuesta sacamos los datos de los usuarios, que es lo que nos sirve
    const users = response.data;

    // le mostramos a la consola del servidoor los nombres que encontramos
    console.log('usuarios obtenidos exitosamente, estos son los datos:');
    // acá uno por uno paa que quede más prolijo
    users.forEach(user => {
      console.log(`  - nombre: ${user.name}, email: ${user.email}`);
    });
    console.log('---------------------------------');


    // y finalmente le mandamos el paquete de usuarios al que nos lo pidió, o sea al navegador
    res.json(users);

  // si algo falló en el try, caemos acá
  } catch (error) {
    // le avisamos a la consola que se pudrió tofo
    console.error('error al obtener los datos de la api externa:', error.message);
    // y le respondemos al navegador que gubo un error
    res.status(500).json({ message: 'error en el servidor al obtener los datos' });
  }
});

// acá prendemos el motor del servidor en el puerto que dijimos
app.listen(PORT, () => {
  // un mensajito para saber que el apparato está funcionando
  console.log(`🚀 servidor corriendo en http://localhost:${PORT}`);
});