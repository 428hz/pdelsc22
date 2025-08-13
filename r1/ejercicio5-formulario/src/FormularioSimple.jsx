import React, { useState } from 'react';
import './FormularioSimple.css';

function FormularioSimple() {
  // un estado para guardar lo que el usuario escribe en el input
  const [nombre, setNombre] = useState('');
  // otro estado para mostrar el mensaje de bienvenida solo después de enviar
  const [nombreEnviado, setNombreEnviado] = useState('');

  // esta función se activa cada vez que escribís o borrás una letra
  const handleInputChange = (evento) => {
    // y lo guarda en el estado nombre
    setNombre(evento.target.value);
  };

  // esta función se activa solo cuando mandás el formulario
  const handleFormSubmit = (evento) => {
    // esto evita que la página se recargue de una
    evento.preventDefault(); 
    // guarda el nombre para mostrar el saludo
    setNombreEnviado(nombre); 
    // limpia el campo de texto para que puedas escribir de nuevo
    setNombre(''); 
  };

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="nombreUsuario">ingresá tu nombre:</label>
        <input 
          type="text" 
          id="nombreUsuario"
          placeholder="ej: clark kent"
          // el valor del input está controlado por el estado
          value={nombre} 
          // cada cambio que hacés se guarda en el estado
          onChange={handleInputChange} 
        />
        <button type="submit">enviar</button>
      </form>

      {/* este mensaje solo aparece si ya mandaste un nombre */}
      {nombreEnviado && (
        <h2 className="welcome-message">
          ¡bienvenido, {nombreEnviado}!
        </h2>
      )}
    </div>
  );
}

export default FormularioSimple;