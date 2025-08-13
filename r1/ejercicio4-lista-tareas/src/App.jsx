// traemos react que es la base para que todo ande
import React from 'react';
// acá importamos nuestro componente principal de la lista de tareas
import ListaTareas from './ListaTareas.jsx';

// app es el componente que arranca todo en este proyecto
function App() {
  // le decimos que en la pantalla tiene que dibujar nuestro componente listatareas
  return (
    <ListaTareas />
  );
}

// y con esto hacemos que el archivo main.jsx pueda usar este componente app
export default App;