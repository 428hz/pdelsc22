import react from 'react';
import './HolaMundo.css'; // acá traemos los estilos que creaste
import './App.css'; 
function holamundo() {
  // y acá usamos la clase 'saludo' para que se vea lindo
  return (
    <div className="saludo">
      <h1>¡hola, mundo!</h1>
    </div>
  );
}

export default holamundo;