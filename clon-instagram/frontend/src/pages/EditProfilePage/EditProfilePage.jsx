import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfilePage.module.css';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

function EditProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const uploadingToast = toast.loading('subiendo nueva foto...');

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('error al subir la imagen.', { id: uploadingToast });
      console.error(uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const urlWithCacheBuster = `${publicUrl}?t=${new Date().getTime()}`;
    setAvatarUrl(urlWithCacheBuster);
    toast.success('¡imagen previsualizada!', { id: uploadingToast });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updates = {
      id: user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      toast.error('hubo un error al actualizar el perfil.');
      console.error(error);
    } else {
      toast.success('¡perfil actualizado con éxito!');
      navigate(`/${username}`);
    }
    setLoading(false);
  };

  if (!profile) {
    return <div>cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleUpdateProfile} className={styles.form}>
        <h1 className={styles.title}>editar perfil</h1>
        
        <div className={styles.avatarSection}>
          <img 
            src={avatarUrl || `https://i.pravatar.cc/150?u=${username}`} 
            alt="avatar" 
            className={styles.avatar}
          />
          <input 
            type="file" 
            ref={avatarInputRef} 
            onChange={handleAvatarUpload} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
          <button type="button" onClick={() => avatarInputRef.current.click()} className={styles.changePhotoButton}>
            cambiar foto
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="username">nombre de usuario</label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'guardando...' : 'guardar cambios'}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;