import { useState, useCallback } from 'react'; // 1. Importamos useCallback
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router'; // 2. Importamos useFocusEffect
import Post from '@/components/Post/Post';
import { supabase } from '../../src/services/supabaseClient';

type PostType = {
  id: string | number;
  author_id: string;
  media_url: string;
  text_content: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
};

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Usamos useFocusEffect en lugar de useEffect
  useFocusEffect(
    useCallback(() => {
      // Esta función se ejecutará cada vez que la pantalla aparezca
      const fetchPosts = async () => {
        setLoading(true); // Mostramos el indicador de carga cada vez que refrescamos
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`*, profiles:author_id ( username, avatar_url )`)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setPosts(data || []);
        } catch (error: any) {
          console.error('Error al cargar las publicaciones:', error.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPosts();
    }, []) // El array vacío asegura que la lógica no se ejecute infinitamente
  );

  const handlePostDeleted = (deletedPostId: string | number) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Post 
            postData={item}
            onDelete={handlePostDeleted}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.feed}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Todavía no hay publicaciones. ¡Sé el primero!</Text>
          </View>
        )}
      />
    </View>
  );
}

// Los estilos no cambian
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feed: {
    width: '100%',
    maxWidth: 614,
    alignSelf: 'center',
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#a8a8a8',
    fontSize: 16,
    textAlign: 'center',
  },
});