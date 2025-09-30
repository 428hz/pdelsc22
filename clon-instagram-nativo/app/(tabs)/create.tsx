import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // 1. Importamos el selector de imágenes de Expo
import { supabase } from '../../src/services/supabaseClient';
import { useAuth } from '../../src/context/AuthContext';
import { decode } from 'base64-arraybuffer'; // 2. Helper para subir la imagen a Supabase

export default function CreatePostPage() {
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<{ uri: string; base64: string; } | null>(null); // 3. Guardaremos la URI y el base64 de la imagen
  const { user } = useAuth();
  const router = useRouter();

  // 4. Esta es la nueva función para abrir la galería del teléfono
  const pickImage = async () => {
    // Pedimos permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Lo sentimos, necesitamos acceso a tu galería para poder subir una foto.');
      return;
    }

    // Abrimos el selector de imágenes
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Forzamos un recorte cuadrado, como en Instagram
      quality: 0.8,
      base64: true, // MUY IMPORTANTE: Le pedimos que nos de el base64 para subirlo a Supabase
    });

    if (!result.canceled) {
      setImage({ 
        uri: result.assets[0].uri, 
        base64: result.assets[0].base64! 
      });
    }
  };

  const handleCreatePost = async () => {
    if (!image) {
      Alert.alert('Error', 'Por favor, selecciona una imagen para publicar.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.');
      return;
    }
    
    setUploading(true);

    try {
      const fileExt = image.uri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // 5. La subida a Supabase ahora se hace con el base64 decodificado
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, decode(image.base64), {
          contentType: `image/${fileExt}`
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          text_content: description,
          media_url: publicUrl,
        });

      if (insertError) throw insertError;

      Alert.alert('¡Éxito!', 'Publicación creada correctamente.');
      router.push('/'); // Volvemos al feed

    } catch (error: any) {
      console.error('Error creating post:', error.message);
      Alert.alert('Error', 'Hubo un error al crear la publicación.');
    } finally {
      setUploading(false);
    }
  };

  return (
    // Usamos ScrollView para que no haya problemas en pantallas pequeñas
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Text style={styles.title}>Crear nueva publicación</Text>
        
        {/* 6. Lógica para mostrar la imagen previsualizada o el botón para seleccionar */}
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        ) : (
          <TouchableOpacity style={styles.fileDropzone} onPress={pickImage}>
            <Text style={styles.fileLabel}>Seleccionar de la galería</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.textarea}
          placeholder="Escribe una descripción..."
          placeholderTextColor="#8e8e8e"
          value={description}
          onChangeText={setDescription}
          multiline={true} // Permite múltiples líneas
        />
        <TouchableOpacity style={styles.button} onPress={handleCreatePost} disabled={uploading}>
          <Text style={styles.buttonText}>
            {uploading ? 'Publicando...' : 'Publicar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Conversión del CSS a StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#363636',
    borderRadius: 8,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 15,
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
    color: 'white',
  },
  fileDropzone: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#363636',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fileLabel: {
    backgroundColor: '#0095f6',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    fontWeight: 'bold',
    overflow: 'hidden', // Necesario para que el borde redondeado se aplique bien en iOS
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  textarea: {
    width: '100%',
    height: 100,
    color: 'white',
    fontSize: 16,
    paddingVertical: 10,
    textAlignVertical: 'top', // Para que el placeholder empiece arriba en Android
  },
  button: {
    backgroundColor: '#0095f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});