import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definimos el tipo de datos que espera el componente, igual que en la pantalla Home
type PostType = {
  id: number;
  text_content: string;
  media_url: string; // Añadimos la URL de la imagen
  profiles: {
    username: string;
  } | null;
};

// Obtenemos el ancho de la pantalla para que la imagen se ajuste
const screenWidth = Dimensions.get('window').width;

export default function Post({ post }: { post: PostType }) {
  const username = post.profiles?.username || 'Usuario';

  return (
    <View style={styles.postContainer}>
      {/* Cabecera del Post */}
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
      </View>
      
      {/* Imagen del Post */}
      <Image source={{ uri: post.media_url }} style={styles.image} />
      
      {/* Acciones (Like, Comentar) */}
      <View style={styles.actionsContainer}>
        <Ionicons name="heart-outline" size={28} color="white" style={styles.actionIcon} />
        <Ionicons name="chatbubble-outline" size={28} color="white" style={styles.actionIcon} />
      </View>

      {/* Descripción */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>{username}</Text> {post.text_content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#363636',
  },
  header: {
    padding: 15,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: screenWidth,
    height: screenWidth, // Hacemos que la imagen sea cuadrada
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  actionIcon: {
    marginRight: 15,
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
  description: {
    color: 'white',
  },
});