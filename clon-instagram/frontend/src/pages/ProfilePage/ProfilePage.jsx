import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';

function ProfilePage() {
  const { username } = useParams();
  const { profile: loggedInUserProfile } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NUEVO: Estados para el sistema de follows ---
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const isOwnProfile = loggedInUserProfile?.username === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username || !loggedInUserProfile) { // Asegurarse de que el usuario logueado ha cargado
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();

        if (profile) {
          setProfileData(profile);
          const { data: postsData } = await supabase.from('posts').select('*').eq('author_id', profile.id).order('created_at', { ascending: false });
          setPosts(postsData || []);

          // --- NUEVO: Cargar datos de seguidores y seguidos ---
          // Contar seguidores (cuántos siguen a ESTE perfil)
          const { count: followers } = await supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.id);
          setFollowerCount(followers || 0);

          // Contar seguidos (cuántos sigue ESTE perfil)
          const { count: following } = await supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', profile.id);
          setFollowingCount(following || 0);
          
          // Si no es nuestro propio perfil, chequear si ya lo seguimos
          if (loggedInUserProfile.id !== profile.id) {
              const { data: followData } = await supabase
                .from('followers')
                .select('*')
                .eq('follower_id', loggedInUserProfile.id)
                .eq('following_id', profile.id)
                .single();
              setIsFollowing(!!followData); // Convierte el resultado en booleano
          }
          // --- FIN DE LO NUEVO ---

        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error.message);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username, loggedInUserProfile]); // Añadimos loggedInUserProfile a las dependencias

  // --- NUEVO: Funciones para seguir y dejar de seguir ---
  const handleFollow = async () => {
    try {
      await supabase.from('followers').insert({
        follower_id: loggedInUserProfile.id,
        following_id: profileData.id,
      });
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } catch (error) {
      console.error('Error al seguir al usuario:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await supabase.from('followers').delete()
        .eq('follower_id', loggedInUserProfile.id)
        .eq('following_id', profileData.id);
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    } catch (error) {
      console.error('Error al dejar de seguir:', error.message);
    }
  };

  if (loading) {
    return <div>cargando perfil...</div>;
  }

  if (!profileData) {
    return <div>perfil no encontrado.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img 
            src={profileData.avatar_url || `https://i.pravatar.cc/150?u=${profileData.username}`} 
            alt={`perfil de ${profileData.username}`} 
            className={styles.profileImage}
          />
        </div>
        <section className={styles.profileInfo}>
          <div className={styles.usernameContainer}>
            <h2 className={styles.username}>{profileData.username}</h2>
            
            {/* --- MODIFICADO: Lógica de botones --- */}
            {isOwnProfile ? (
              <Link to="/settings/edit-profile" className={styles.editProfileButton}>
                editar perfil
              </Link>
            ) : isFollowing ? (
              <button onClick={handleUnfollow} className={styles.unfollowButton}>
                Dejar de seguir
              </button>
            ) : (
              <button onClick={handleFollow} className={styles.followButton}>
                Seguir
              </button>
            )}
          </div>

          {/* --- MODIFICADO: Contadores dinámicos --- */}
          <ul className={styles.stats}>
            <li><span className={styles.statCount}>{posts.length}</span> publicaciones</li>
            <li><span className={styles.statCount}>{followerCount}</span> seguidores</li>
            <li><span className={styles.statCount}>{followingCount}</span> seguidos</li>
          </ul>
        </section>
      </header>
      <div className={styles.postGrid}>
        {posts.map(post => (
          <div key={post.id} className={styles.postItem}>
            <img src={post.media_url} alt={`post de ${profileData.username}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;