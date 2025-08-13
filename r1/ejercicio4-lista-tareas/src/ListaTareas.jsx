// traemos react y los hooks usestate y useeffect
// usestate es para la memoria a corto plazo del componente
// useeffect es para hacer algo cuando esa memoria cambia
import React, { useState, useEffect } from 'react';
import './ListaTareas.css';

// acá nos fijamos si el navegador ya tiene tareas guardadas de antes en el localstorage
const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));

function ListaTareas() {
  // si encontramos algo guardado, usamos esa lista para empezar
  // si no hay nada, arrancamos con una lista de ejemplo
  const [tareas, setTareas] = useState(tareasGuardadas || [
    { id: 1, texto: 'estar atr', completada: false },
    { id: 2, texto: 'vivir sin berretin', completada: false },
  ]);
  // este otro estado es para ir guardando lo que escribís en el campo de texto
  const [textoNuevaTarea, setTextoNuevaTarea] = useState('');

  // este useeffect es como un espía que se activa cada vez que la lista de tareas cambia
  useEffect(() => {
    // y cuando cambia, agarra la lista nueva y la guarda en el navegador para que no se pierda
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]); // el [tareas] al final es para decirle que solo espíe a la lista de tareas

  // esta función se activa cuando mandás el formulario para agregar una tarea
  const handleAgregarTarea = (e) => {
    // frenamos que la página se recargue
    e.preventDefault();
    // si el campo de texto está vacío, no hacemos nada
    if (textoNuevaTarea.trim() === '') return;

    // creamos la tarea nueva como un objeto
    const nueva = {
      id: Date.now(),
      texto: textoNuevaTarea,
      completada: false,
    };
    // actualizamos la lista de tareas agregando la nueva al final
    setTareas([...tareas, nueva]);
    // limpiamos el campo de texto
    setTextoNuevaTarea('');
  };

  // esta otra se activa cuando le hacés clic a una tarea para tacharla o destacharla
  const handleToggleCompletada = (id) => {
    // recorremos la lista de tareas
    setTareas(
      tareas.map(tarea =>
        // si encontramos la que tiene el id que tocamos
        tarea.id === id
          // le invertimos el valor de completada, o sea de true a false o viceversa
          ? { ...tarea, completada: !tarea.completada }
          // si no es la que tocamos, la dejamos como estaba
          : tarea
      )
    );
  };

  return (
    <div className="lista-container">
      <h1>lista de tareas con memoria</h1>
      <form onSubmit={handleAgregarTarea} className="form-agregar">
        <input
          type="text"
          placeholder="añadir nueva tarea..."
          value={textoNuevaTarea}
          onChange={(e) => setTextoNuevaTarea(e.target.value)}
        />
        <button type="submit">agregar</button>
      </form>
      <ul className="lista">
        {/* acá recorremos la lista de tareas y por cada una dibujamos un renglón */}
        {tareas.map(tarea => (
          <li
            key={tarea.id} // el key es para que react no se confunda de renglón
            className={tarea.completada ? 'completada' : ''} // si está completada, le agregamos la clase para tacharla
            onClick={() => handleToggleCompletada(tarea.id)} // al hacerle clic, la tacha o destacha
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;