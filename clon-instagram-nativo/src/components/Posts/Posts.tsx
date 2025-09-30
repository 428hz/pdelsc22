// Posts.tsx - Versión corregida completa
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import AddCommentForm from '../AddCommentForm/AddCommentForm';

interface PostProps {
  postData: {
    id: string | number;
    author_id: string;
    media_url: string;
    text_content: string;
    profiles: {
      username: string;
      avatar_url: string;
    };
  };
  onDelete: (postId: string | number) => void;
}

export default function Post({ postData, onDelete }: PostProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
   const [isSubmittingLike, setIsSubmittingLike] = useState(false);

  const authorUsername = postData.profiles?.username || 'usuario desconocido';
  const canDelete = user && (profile?.role === 'Moderador' || postData.author_id === user.id);

  useEffect(() => {
    const fetchLikesCount = async () => {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postData.id);

      if (error) {
        console.error('Error fetching likes count:', error);
      } else {
        setLikesCount(count || 0);
      }
    };

   const checkIfLiked = async () => {
  if (!user) return;
  
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postData.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error checking like:', error);
    return;
  }
  
  setIsLiked(data && data.length > 0);
};

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`*, profiles (username, avatar_url)`)
        .eq('post_id', postData.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
    };
    
    if (postData.id) {
      fetchLikesCount();
      checkIfLiked();
      fetchComments();
    }
  }, [postData.id, user]);

  const handleLike = async () => {
  // AÑADIMOS ESTA COMPROBACIÓN DE SEGURIDAD
  if (!user) {
    Alert.alert('Error', 'Necesitas iniciar sesión para dar me gusta.');
    return;
  }

  // Si ya hay una petición en curso, no hacemos nada para evitar dobles clics
  if (isSubmittingLike) return;
  
  setIsSubmittingLike(true);

  // Guardamos el estado actual por si necesitamos revertirlo en caso de error
  const originalLikedState = isLiked;
  const originalLikesCount = likesCount;

  // 1. Actualización Optimista: Cambiamos la UI al instante
  setIsLiked(!originalLikedState);
  setLikesCount(originalLikesCount + (originalLikedState ? -1 : 1));

  if (originalLikedState) {
    // --- Lógica para QUITAR un like (se ejecuta en segundo plano) ---
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postData.id)
      .eq('user_id', user.id); // Ahora TypeScript sabe que 'user' no es null aquí

    if (error) {
      // 3. Si hay un error, revertimos los cambios en la UI
      setIsLiked(originalLikedState);
      setLikesCount(originalLikesCount);
      Alert.alert("Error", "No se pudo quitar el like.");
      console.error("Error al quitar like:", error);
    }
  } else {
    // --- Lógica para DAR un like (se ejecuta en segundo plano) ---
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postData.id, user_id: user.id }); // Y tampoco es null aquí
    
    if (error) {
      // 3. Si hay un error, revertimos los cambios en la UI
      setIsLiked(originalLikedState);
      setLikesCount(originalLikesCount);
      Alert.alert("Error", "No se pudo dar el like.");
      console.error("Error al dar like:", error);
    }
  }

  // La petición ha terminado, permitimos nuevos clics
  setIsSubmittingLike(false);
};

  const handleNewComment = (newComment: any) => {
    setComments([...comments, newComment]);
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    Alert.alert(
      "Eliminar Publicación",
      "¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // Primero eliminar los comentarios asociados
              await supabase.from('comments').delete().eq('post_id', postData.id);
              
              // Eliminar los likes asociados
              await supabase.from('likes').delete().eq('post_id', postData.id);
              
              // Eliminar la imagen del storage si existe
              if (postData.media_url) {
                const fileName = postData.media_url.split('/').pop();
                if (fileName) {
                  await supabase.storage.from('posts').remove([fileName]);
                }
              }
              
              // Finalmente eliminar el post
              const { error } = await supabase.from('posts').delete().eq('id', postData.id);
              
              if (error) throw error;
              
              onDelete(postData.id);
            } catch (error: any) {
              Alert.alert("Error", "No se pudo eliminar la publicación: " + error.message);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href={`/${authorUsername}`} asChild>
          <TouchableOpacity style={styles.authorInfo}>
            <Image 
              source={{ uri: postData.profiles.avatar_url || `https://i.pravatar.cc/150?u=${authorUsername}` }} 
              style={styles.profilePic} 
            />
            <Text style={styles.username}>{authorUsername}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Image source={{ uri: postData.media_url }} style={styles.postImage} />

      <View style={styles.postActions}>
        <View style={styles.mainActions}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? "#ff3040" : "white"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(!showComments)}>
            <Ionicons name="chatbubble-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.postInfo}>
        <Text style={styles.likes}>{likesCount} me gusta</Text>
        <Text style={styles.description}>
          <Link href={`/${authorUsername}`} asChild>
            <Text style={styles.usernameLink}>{authorUsername}</Text>
          </Link>
          {' '}
          {postData.text_content}
        </Text>
        {comments.length > 0 && (
          <View style={styles.commentsSection}>
            <TouchableOpacity onPress={() => setShowComments(!showComments)}>
              <Text style={styles.toggleComments}>
                {showComments ? 'Ocultar comentarios' : `Ver los ${comments.length} comentarios`}
              </Text>
            </TouchableOpacity>
            {showComments && (
              <View style={styles.commentList}>
                {comments.map(comment => (
                  <View key={comment.id} style={styles.comment}>
                    <Link href={`/${comment.profiles.username}`} asChild>
                      <Text style={styles.usernameLink}>{comment.profiles.username}</Text>
                    </Link>
                    <Text style={{ color: 'white' }}>{comment.comment_text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <AddCommentForm postId={postData.id} onNewComment={handleNewComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    width: '100%',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  mainActions: {
    flexDirection: 'row',
    gap: 16,
  },
  postInfo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likes: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  description: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
  },
  usernameLink: {
    fontWeight: 'bold',
    color: 'white',
  },
  commentsSection: {
    marginTop: 8,
  },
  toggleComments: {
    color: '#a8a8a8',
    fontSize: 14,
    marginBottom: 8,
  },
  commentList: {
    gap: 4,
  },
  comment: {
    flexDirection: 'row',
    gap: 5,
  },
});