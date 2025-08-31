// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './Header.module.css'; // Importamos los estilos

function Header({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Redirigimos al login después de cerrar sesión
  };

  return (
    <header className={styles.header}>
      {/* ¡IMPORTANTE! Asegurarse que el Link use la clase styles.logo */}
      <Link to="/" className={styles.logo}>mi portfolio</Link>
      
      <nav className={styles.nav}>
        {/* Usamos <a> para links a IDs dentro de la misma página */}
        <a href="/#proyectos">proyectos</a>
        <a href="/#experiencia">experiencia</a>
        <a href="/#contacto">contacto</a>
        
        {/* Lógica condicional para mostrar login/cerrar sesión */}
        {session ? (
          <button onClick={handleLogout} className={styles.loginButton}>
            cerrar sesión
          </button>
        ) : (
          <Link to="/login" className={styles.loginButton}>
            login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;