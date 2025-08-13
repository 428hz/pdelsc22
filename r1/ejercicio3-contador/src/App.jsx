// traemos react que es la base de todo
import React from 'react';
// acá importamos el componente del contador que hicimos en el otro archivo
import Contador from './Contador.jsx';

// app es el componente principal de este proyecto
function App() {
  // le decimos que en la pantalla tiene que dibujar nuestro contador
  return (
    <Contador />
  );
}

// con esto hacemos que el archivo main.jsx pueda usar este componente app
export default App;