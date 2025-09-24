// src/components/AddCommentForm.jsx
import { useState } from 'react';
import { supabase } from "../../supabaseClient.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from './AddCommentForm.module.css';
import toast from 'react-hot-toast';

function AddCommentForm({ postId, onNewComment }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          comment_text: commentText,
        })
        .select(`*, profiles (username, avatar_url)`) // Pedimos que nos devuelva el comentario con el perfil
        .single();

      if (error) throw error;
      
      onNewComment(data); // Enviamos el nuevo comentario al componente padre (Post.jsx)
      setCommentText(''); // Limpiamos el input
    } catch (error) {
      toast.error('No se pudo publicar el comentario.');
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <input
        type="text"
        placeholder="Añade un comentario..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className={styles.commentInput}
        disabled={!user}
      />
      <button type="submit" className={styles.submitButton} disabled={isSubmitting || !commentText.trim()}>
        Publicar
      </button>
    </form>
  );
}

export default AddCommentForm;