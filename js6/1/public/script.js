// acá agarra,os los botones y el coso donde van a ir las tarjetas
const fetchBtn = document.getElementById('fetch-btn');
const axiosBtn = document.getElementById('axios-btn');
const userContainer = document.getElementById('user-container');

// esta es la direción de nuestro propio servidor, la que creamos en el server.js
const API_ENDPOINT = '/api/users';

/**
 * esta función se encarga de dibujar todo en la pantalla
 * @param {array} users - el array de objetos de usuario
 */
const displayUsers = (users) => {
  // primero borramos lo que había antes, para no amontonar
  userContainer.innerHTML = '';
  
  // mostramos los datos que llegaron en la consola del navegador, para chusmear
  console.log('datos recibidos en el cliente:', users);

  // ahora por cada usuario que llegó, hacemos una tarjetita
  users.forEach(user => {
    // creamos un elemento div, una cajiita para el usuario
    const userCard = document.createElement('div');
    // le ponemos la clase para que tenga los estilos del css
    userCard.className = 'user-card';
    // acá adentro le metems el nombre y el mail con html
    userCard.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `;
    // y colgamos la tarjeta nueva en el contnedor principal
    userContainer.appendChild(userCard);
  });
};

/**
 * esta es la función para pedir las cosas usando fetch
 */
const getUsersWithFetch = async () => {
  // avisamos en la consola que estamos usando este método
  console.log('pidiendo datos con fetch...');
  // intentamos la movida
  try {
    // hacemos la llamada con fetch y esperamos a que responda
    const response = await fetch(API_ENDPOINT);
    // fetch es medio especial, tenemos que chequear a mano si no hubo un error http
    if (!response.ok) {
      throw new Error(`error http: ${response.status}`);
    }
    // si todo fue bien, convertimos la respuesta en algo que podamos usar
    const users = await response.json();
    // y llamamos a la función que """dibuja""" todo en pantalla
    displayUsers(users);
  // si la movida con fetch falló, venimos para acá
  } catch (error) {
    console.error('error al usar fetch:', error);
    userContainer.innerHTML = `<p style="color: red;">error al cargar los datos</p>`;
  }
};

/**
 * y esta otra es casi lo mismo pero con la librería axios
 */
const getUsersWithAxios = async () => {
  // avisamos que ahora usamos el otro aparato
  console.log('pidiendo datos con axios...');
  try {
    // axios es más directo, pedimos y ya nos da la respuesta
    const response = await axios.get(API_ENDPOINT);
    const users = response.data;
    // y de nuevo, a """dibujar"""
    displayUsers(users);
  // si se rompe axios, lo agarramos acá
  } catch (error) {
    console.error('error al usar axios:', error);
    userContainer.innerHTML = `<p style="color: red;">error al cargar los datos</p>`;
  }
};

// y al final de todo, le decimos a cada botón qué función tiene que llamar cuando le hagan clic
fetchBtn.addEventListener('click', getUsersWithFetch);
axiosBtn.addEventListener('click', getUsersWithAxios);