// traemos react que es la base de todo
import React from 'react';
// acá traemos los estilos propios de la tarjeta
import './TarjetaPresentacion.css';

// creamos el componente
// fijate que acá agarramos los props que nos pasan, o sea la data, directamente
function TarjetaPresentacion({ nombre, profesion, imagenUrl }) {
  // acá va lo que se dibuja en la pantalla
  return (
    // la caja principal con la clase para el css
    <div className="tarjeta">
      
      {/* la foto, la url la saca de los props */}
      <img 
        className="tarjeta-imagen" 
        src={imagenUrl} 
        // el alt es un texto que aparece si la foto no carga
        alt={`foto de ${nombre}`} 
      />

      {/* un div para el texto */}
      <div className="tarjeta-info">
        {/* acá ponemos el nombre que nos pasaron por props */}
        <h2>{nombre}</h2>
        {/* y acá la profesión */}
        <p>{profesion}</p>
      </div>
      
    </div>
  );
}

// exportamos el componente para poder usarlo en otro lado, como en el app.jsx
export default TarjetaPresentacion;