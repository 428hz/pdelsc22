import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotificationsPage.module.css';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

// Este sub-componente no cambia
const NotificationMessage = ({ notification }) => {
  const actorLink = <Link to={`/${notification.actor.username}`} className={styles.actorUsername}>{notification.actor.username}</Link>;
  switch (notification.type) {
    case 'follow':
      return <>{actorLink} comenzó a seguirte.</>;
    case 'like':
      return <>{actorLink} le dio me gusta a tu publicación.</>;
    default:
      return null;
  }
};

function NotificationsPage() {
  const { profile: loggedInUserProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  // --- MODIFICADO: Iniciaremos la carga en `false` y la activaremos solo cuando sea necesario ---
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si el perfil del usuario aún no ha cargado desde el contexto, no hacemos nada todavía.
    if (!loggedInUserProfile) {
      return; 
    }

    const fetchAndMarkNotifications = async () => {
      setLoading(true); // Ahora sí, empezamos a cargar
      try {
        // 1. Buscamos las notificaciones
        const { data, error } = await supabase
          .from('notifications')
          .select(`id, created_at, type, is_read, post_id, actor:actor_id ( username, avatar_url )`)
          .eq('user_id', loggedInUserProfile.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setNotifications(data || []);

        // 2. Las marcamos como leídas (solo las que no lo estén)
        const unreadIds = (data || []).filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length > 0) {
          await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);
        }
      } catch (error) {
        console.error('Error al procesar notificaciones:', error.message);
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };

    fetchAndMarkNotifications();
  }, [loggedInUserProfile]); // El efecto se disparará en cuanto loggedInUserProfile esté disponible

  // --- MODIFICADO: Lógica de renderizado más clara ---

  // Estado 1: El contexto de Auth todavía está cargando el perfil.
  if (!loggedInUserProfile) {
    return <div className={styles.container}>Cargando sesión...</div>;
  }

  // Estado 2: Ya tenemos el perfil y estamos cargando las notificaciones.
  if (loading) {
    return <div className={styles.container}>Cargando notificaciones...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notificaciones</h1>
      <div className={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className={styles.notificationItem}>
              <Link to={`/${notification.actor.username}`}>
                <img 
                  src={notification.actor.avatar_url || `https://i.pravatar.cc/50?u=${notification.actor.username}`} 
                  alt={notification.actor.username} 
                  className={styles.avatar}
                />
              </Link>
              <p className={styles.text}>
                <NotificationMessage notification={notification} />
                <span className={styles.timestamp}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>No tienes notificaciones nuevas.</p>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;