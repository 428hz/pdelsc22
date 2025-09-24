import { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Post from '../../components/Post/Post.jsx';
import { supabase } from '../../supabaseClient.js';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:author_id ( username, avatar_url ), 
            likes ( count )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.feed}>
        {loading ? (
          <p>cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <p>Todavía no hay publicaciones. ¡Sé el primero!</p>
        ) : (
          posts.map((post) => (
            <Post 
              key={post.id}
              postData={post}
              onDelete={handlePostDeleted}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default HomePage;