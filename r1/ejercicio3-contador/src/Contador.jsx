// traemos react y el hook usestate que es el que nos deja guardar cosas en la memoria
import React, { useState } from 'react';
import './Contador.css';

function Contador() {
  // acá creamos el estado que se llama contador y arranca en 0
  // usestate nos devuelve el valor actual y una función para cambiarlo
  const [contador, setContador] = useState(0);

  // estas son las funciones que se activan con los botones
  // la función para sumar uno
  const incrementar = () => {
    // esto le dice a react 'agarrá el número que tenías y sumale uno'
    setContador(contadorActual => contadorActual + 1);
  };

  // la función para restar uno
  const decrementar = () => {
    // y esto le dice 'agarrá el número que tenías y restale uno'
    setContador(contadorActual => contadorActual - 1);
  };

  return (
    <div className="contador-container">
      {/* acá mostramos el número que está guardado en el estado */}
      <h2 className="contador-display">{contador}</h2>
      <div className="contador-botones">
        {/* cuando le hacés clic a este botón, llama a la función de sumar */}
        <button onClick={incrementar}>incrementar +</button>
        {/* y este a la de restar */}
        <button onClick={decrementar}>decrementar -</button>
      </div>
    </div>
  );
}

export default Contador;