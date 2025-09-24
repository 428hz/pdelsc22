import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePostPage.module.css';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

function CreatePostPage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('por favor, selecciona una imagen para publicar.');
      return;
    }
    if (!user) {
      toast.error('no se pudo identificar al usuario. por favor, inicia sesión de nuevo.');
      return;
    }
    
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // --- CORRECCIÓN AQUÍ ---
      const { error: uploadError } = await supabase.storage
        .from('posts') // Cambiado de 'post_images' a 'posts'
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      // --- Y CORRECCIÓN AQUÍ ---
      const { data: { publicUrl } } = supabase.storage
        .from('posts') // Cambiado de 'post_images' a 'posts'
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          text_content: description,
          media_url: publicUrl,
        });
      if (insertError) throw insertError;

      toast.success('¡publicación creada con éxito!');
      navigate('/');

    } catch (error) {
      console.error('Error creating post:', error.message);
      toast.error('hubo un error al crear la publicación.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.content}>
      <form onSubmit={handleCreatePost} className={styles.form}>
        <h1 className={styles.title}>crear nueva publicación</h1>
        {preview ? (
          <img src={preview} alt="vista previa" className={styles.previewImage} />
        ) : (
          <div className={styles.fileDropzone}>
            <label htmlFor="file-upload" className={styles.fileLabel}>seleccionar del ordenador</label>
            <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*,video/*" />
          </div>
        )}
        <textarea
          className={styles.textarea}
          placeholder="escribe una descripción..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={uploading}>
          {uploading ? 'publicando...' : 'publicar'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;