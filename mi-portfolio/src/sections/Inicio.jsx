// src/components/Inicio.jsx
import React from 'react';
import styles from './Inicio.module.css'; // 1. Importamos el archivo CSS

function Inicio() {
  return (
    // 2. Aplicamos la clase principal a la sección
    <section id="inicio" className={styles.inicio}>
      <h2 className={styles.titulo}>¡hola! soy ian olejnik</h2>
      <p className={styles.subtitulo}>desarrollador web full stack | apasionado por la tecnología y el diseño</p>
    </section>
  );
}

export default Inicio;