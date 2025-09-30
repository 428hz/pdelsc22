import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons'; // 1. Usamos Ionicons de @expo/vector-icons

export default function Header() {
  const { signOut, profile } = useAuth();
  const router = useRouter(); // 2. Reemplazamos useNavigate por useRouter

  const handleSignOut = async () => {
    await signOut();
    // 3. La navegación es igual, pero con el router de Expo
    router.replace('/login');
  };

  return (
    // 4. El <header> ahora es un <View>. No necesitamos "position: fixed".
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Link href="/">
            {/* 5. El <h1> es ahora <Text>. La fuente 'Grand Hotel' debe cargarse aparte. */}
            <Text style={styles.logo}>Instagram</Text>
          </Link>
        </View>
        
        {/* El input de búsqueda ahora es un TextInput */}
        <TextInput
          placeholder="Búsqueda"
          style={styles.searchInput}
          placeholderTextColor="#a8a8a8"
        />

        <View style={styles.navIcons}>
          {/* 6. Cada ícono es un <Link> que envuelve un componente <Ionicons> */}
          <Link href="/" asChild>
            <TouchableOpacity><Ionicons name="home-outline" style={styles.icon} /></TouchableOpacity>
          </Link>
          <Link href="/create" asChild>
            <TouchableOpacity><Ionicons name="add-circle-outline" style={styles.icon} /></TouchableOpacity>
          </Link>
          <Link href="/notifications" asChild>
            <TouchableOpacity><Ionicons name="heart-outline" style={styles.icon} /></TouchableOpacity>
          </Link>
          
          {profile && (
            <Link href={`/${profile.username}`} asChild>
              <TouchableOpacity>
                <Image 
                  source={{ uri: profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.username}` }}
                  style={styles.profilePic} 
                />
              </TouchableOpacity>
            </Link>
          )}
          
          {/* 7. El ícono de logout ahora es un TouchableOpacity para manejar el onPress */}
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="log-out-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 8. Conversión del CSS a StyleSheet
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logo: {
    fontFamily: 'System', // Cambiar cuando se cargue la fuente custom 'Grand Hotel'
    fontSize: 28,
    color: 'white',
  },
  searchInput: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#363636',
    borderRadius: 8,
    padding: 8,
    color: '#a8a8a8',
    width: '40%', // Usamos porcentajes para la flexibilidad
    textAlign: 'center',
    fontSize: 14,
  },
  navIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },
  icon: {
    color: 'white',
    fontSize: 26, // Ligeramente más grande para mobile
  },
  profilePic: {
    width: 28,
    height: 28,
    borderRadius: 14, // La mitad del tamaño para hacerlo un círculo
    borderWidth: 1,
    borderColor: '#555',
  },
});