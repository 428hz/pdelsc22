// src/components/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    // APLICAMOS EL ID AQUÍ
    <footer id="contacto" className={styles.footer}>
      <div className={styles.footerContent}>
        <h3>contacto</h3>
        <p>¿interesado en colaborar? ¡hablemos!</p>
        <ul className={styles.socialLinks}>
          <li><a href="mailto:tu.email@ejemplo.com">email</a></li>
          <li><a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer">linkedin</a></li>
          <li><a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer">github</a></li>
        </ul>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {anioActual} ian olejnik. todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;