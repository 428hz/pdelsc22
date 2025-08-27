// src/components/Proyectos.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Importamos la conexión

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProyectos() {
      try {
        setLoading(true);
        // Esta es la línea mágica que pide los datos a tu tabla 'proyectos'
        const { data, error } = await supabase
          .from('proyectos')
          .select('*');

        if (error) {
          throw error;
        }
        if (data) {
          setProyectos(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProyectos();
  }, []);

  if (loading) {
    return <p>Cargando proyectos desde Supabase...</p>;
  }

  return (
    <section id="proyectos">
      <h2>Mis Proyectos</h2>
      {proyectos.map(proyecto => (
        <div key={proyecto.id} style={{ border: '1px solid grey', padding: '1rem', margin: '1rem 0' }}>
          <h3>{proyecto.nombre}</h3>
          <p>{proyecto.descripcion}</p>
          <div>
            <strong>Tecnologías:</strong>
            <ul>
              {proyecto.tecnologias.map(tech => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Proyectos;