// traemos react que es la base de todo
import React from 'react';
// acá importamos el componente del formulario que creamos en el otro archivo
import FormularioSimple from './FormularioSimple.jsx';

// app es el componente principal, la raíz de nuestra aplicación para este ejercicio
function App() {
  // acá le decimos a react que lo único que tiene que mostrar en la pantalla es nuestro formulario
  return (
    <FormularioSimple />
  );
}

// y con esto dejamos que otros archivos, como el main.jsx, puedan usar este componente app
export default App;