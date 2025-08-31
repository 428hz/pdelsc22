// src/components/Habilidades.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import styles from './Habilidades.module.css'; // Importamos los estilos del módulo
import { motion } from 'framer-motion';

function Habilidades() {
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    async function getHabilidades() {
      const { data } = await supabase.from('habilidades').select('nombre');
      if (data) {
        setHabilidades(data);
      }
    }
    getHabilidades();
  }, []);

  return (
    <section id="habilidades" className={styles.habilidades}>
      <h2>habilidades técnicas</h2>
      <motion.ul
        className={styles.lista} // Aplicamos la clase para la grilla
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {habilidades.map(habilidad => (
          <li key={habilidad.nombre} className={styles.item}> {/* Aplicamos la clase para cada burbuja */}
            {habilidad.nombre}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}

export default Habilidades;