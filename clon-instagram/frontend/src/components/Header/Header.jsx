// src/components/Header/Header.jsx

import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { IoHomeOutline, IoPaperPlaneOutline, IoAddCircleOutline, IoCompassOutline, IoHeartOutline, IoLogOutOutline } from "react-icons/io5";

function Header() {
  const { signOut, profile } = useAuth(); // Profile contiene el avatar_url
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}><Link to="/"><h1 className={styles.logo}>instagram</h1></Link></div>
        <div className={styles.searchContainer}><input type="text" placeholder="Búsqueda" className={styles.searchInput} /></div>

        <nav className={styles.navIcons}>
          <Link to="/"><IoHomeOutline className={styles.icon} /></Link>
          <Link to="/messages"><IoPaperPlaneOutline className={styles.icon} /></Link>
          <Link to="/create"><IoAddCircleOutline className={styles.icon} /></Link>
          <Link to="/explore"><IoCompassOutline className={styles.icon} /></Link>
          <Link to="/notifications"><IoHeartOutline className={styles.icon} /></Link>

          {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
          {profile && (
            <Link to={`/${profile.username}`}>
              <img 
                src={profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.username}`}
                alt={`Perfil de ${profile.username}`}
                className={styles.profilePic} 
              />
            </Link>
          )}

          <IoLogOutOutline 
            className={styles.icon} 
            onClick={handleSignOut} 
            title="Cerrar sesión" 
          />
        </nav>
      </div>
    </header>
  );
}

export default Header;