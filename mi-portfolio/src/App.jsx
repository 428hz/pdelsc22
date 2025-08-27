// src/App.jsx
import React from 'react';
import Header from './components/Header';
import Inicio from './components/Inicio';
import Habilidades from './components/Habilidades';
import Proyectos from './components/Proyectos';
import Experiencia from './components/Experiencia';
import Contacto from './components/Contacto';

function App() {
  return (
    <div>
      <Header />
      <Inicio />
      <Habilidades />
      <Proyectos />
      <Experiencia />
      <Contacto />
    </div>
  );
}

export default App;