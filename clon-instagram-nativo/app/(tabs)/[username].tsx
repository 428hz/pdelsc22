import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/context/AuthContext';

// Obtenemos el ancho de la pantalla para calcular el tamaño de las imágenes de la grilla
const { width } = Dimensions.get('window');
const postSize = (width - 4) / 3; // (Ancho total - espacios) / 3 columnas

export default function ProfilePage() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { profile: loggedInUserProfile } = useAuth();
  
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  const isOwnProfile = loggedInUserProfile?.username === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username || !loggedInUserProfile) return;
      
      setLoading(true);
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (!profile) throw new Error("Perfil no encontrado");

        setProfileData(profile);
        const { data: postsData } = await supabase.from('posts').select('*').eq('author_id', profile.id).order('created_at', { ascending: false });
        setPosts(postsData || []);

        // --- La lógica para contar seguidores y seguidos es la misma ---
        const { count: followers } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', profile.id);
        setFollowerCount(followers || 0);

        const { count: following } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id);
        setFollowingCount(following || 0);
        
        if (loggedInUserProfile.id !== profile.id) {
          const { data: followData } = await supabase.from('followers').select('*').eq('follower_id', loggedInUserProfile.id).eq('following_id', profile.id).maybeSingle();
          setIsFollowing(!!followData);
        }

      } catch (error: any) {
        console.error('Error al cargar perfil:', error.message);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username, loggedInUserProfile]);

  // --- Las funciones para seguir y dejar de seguir son las mismas ---
  const handleFollow = async () => { /* ...lógica idéntica... */ };
  const handleUnfollow = async () => { /* ...lógica idéntica... */ };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color="white" />;
  }

  if (!profileData) {
    return <View style={styles.centered}><Text style={{color: 'white'}}>Perfil no encontrado.</Text></View>;
  }

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={ // Usamos ListHeaderComponent para que la cabecera haga scroll con la grilla
        <View style={styles.headerContainer}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: profileData.avatar_url || `https://i.pravatar.cc/150?u=${profileData.username}` }} 
              style={styles.profileImage}
            />
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statCount}>{posts.length}</Text>
                <Text style={styles.statLabel}>Publicaciones</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statCount}>{followerCount}</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statCount}>{followingCount}</Text>
                <Text style={styles.statLabel}>Seguidos</Text>
              </View>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.username}>{profileData.username}</Text>
            {/* Aquí iría la biografía del usuario si la tuvieras */}
          </View>
          
          <View style={styles.buttonsContainer}>
            {isOwnProfile ? (
              <Link href="/settings/edit-profile" asChild>
                <TouchableOpacity style={styles.editProfileButton}>
                  <Text style={styles.buttonText}>Editar perfil</Text>
                </TouchableOpacity>
              </Link>
            ) : isFollowing ? (
              <TouchableOpacity onPress={handleUnfollow} style={styles.unfollowButton}>
                <Text style={styles.buttonText}>Dejar de seguir</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
                <Text style={styles.buttonText}>Seguir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3} // 1. La clave para crear la grilla de 3 columnas
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.postItem}>
          <Image source={{ uri: item.media_url }} style={styles.postImage} />
        </TouchableOpacity>
      )}
    />
  );
}

// --- Conversión completa del CSS ---
const styles = StyleSheet.create({
   container: { 
    flex: 1, 
    backgroundColor: '#000',
   width: '100%',      // <-- AÑADE ESTO
    maxWidth: 935, 
    alignSelf: 'center',     // <-- AÑADE ESTO
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  headerContainer: { padding: 15 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statCount: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  statLabel: { color: 'white', fontSize: 14 },
  bioContainer: { marginBottom: 15 },
  username: { color: 'white', fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', gap: 10 },
  editProfileButton: { flex: 1, backgroundColor: '#363636', borderRadius: 8, padding: 8, alignItems: 'center' },
  followButton: { flex: 1, backgroundColor: '#0095f6', borderRadius: 8, padding: 8, alignItems: 'center' },
  unfollowButton: { flex: 1, backgroundColor: '#363636', borderRadius: 8, padding: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  postItem: { width: postSize, height: postSize, margin: 1 },
  postImage: { width: '100%', height: '100%' },
});