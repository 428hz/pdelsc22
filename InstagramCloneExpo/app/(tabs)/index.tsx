import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/services/supabaseClient';
import Post from '../../src/components/Post/Post'; // <-- 1. IMPORTAMOS EL NUEVO COMPONENTE

// Ya no necesitamos definir PostType aquí, porque está en el componente Post
type PostType = {
  id: number;
  text_content: string;
  media_url: string; // Añadimos la URL para que la consulta la incluya
  profiles: {
    username: string;
  } | null;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles:author_id ( username )') // La consulta sigue igual
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />} // <-- 2. USAMOS EL NUEVO COMPONENTE
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay publicaciones.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  }
});