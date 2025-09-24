import styles from './Post.module.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoPaperPlaneOutline, IoBookmarkOutline, IoTrashOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
// Esta es la línea CORRECTA
import AddCommentForm from '../AddCommentForm/AddCommentForm.jsx';

function Post({ postData, onDelete }) {
  const { user, profile } = useAuth();
  
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  
  const authorUsername = postData.profiles?.username || 'usuario desconocido';
  const canDelete = user && (profile?.role === 'Moderador' || postData.author_id === user.id);

  useEffect(() => {
    // Cargar likes
    const fetchLikesCount = async () => {
      const { count, error } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', postData.id);
      if (!error) setLikesCount(count || 0);
    };

    const checkIfLiked = async () => {
      if (!user) return;
      const { data, error } = await supabase.from('likes').select('*').eq('post_id', postData.id).eq('user_id', user.id).single();
      if (data && !error) setIsLiked(true);
    };

    // Cargar comentarios
    const fetchComments = async () => {
      const { data, error } = await supabase.from('comments').select(`*, profiles (username, avatar_url)`).eq('post_id', postData.id).order('created_at', { ascending: true });
      if (!error) setComments(data);
    };
    
    if (postData.id) {
      fetchLikesCount();
      checkIfLiked();
      fetchComments();
    }
  }, [postData.id, user]);

  const handleLike = async () => {
    if (!user) return toast.error('Necesitas iniciar sesión para dar me gusta.');
    if (isLiked) {
      const { error } = await supabase.from('likes').delete().match({ post_id: postData.id, user_id: user.id });
      if (!error) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      }
    } else {
      const { error } = await supabase.from('likes').insert({ post_id: postData.id, user_id: user.id });
      if (!error) {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    }
  };

  const handleNewComment = (newComment) => {
    setComments([...comments, newComment]);
  };
  
  const handleDelete = () => {
    if (!canDelete) return;
    toast((t) => (
      <div className={styles.confirmationToast}>
        <p>¿Eliminar esta publicación?</p>
        <div className={styles.toastButtons}>
          <button
            className={`${styles.toastButton} ${styles.confirmButton}`}
            onClick={async () => {
              toast.dismiss(t.id);
              const deletingToast = toast.loading('Eliminando...');
              try {
                const fileName = postData.media_url.split('/').pop();
                await supabase.storage.from('posts').remove([fileName]);
                await supabase.from('posts').delete().eq('id', postData.id);
                toast.success('Publicación eliminada.', { id: deletingToast });
                onDelete(postData.id);
              } catch (error) {
                console.error("Error al eliminar:", error);
                toast.error('Hubo un error al eliminar.', { id: deletingToast });
              }
            }}
          >
            Eliminar
          </button>
          <button className={`${styles.toastButton} ${styles.cancelButton}`} onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  return (
    <article className={styles.post}>
      <div className={styles.postHeader}>
        <Link to={`/${authorUsername}`} className={styles.authorInfo}>
          <img src={postData.profiles.avatar_url || `https://i.pravatar.cc/150?u=${authorUsername}`} alt={`perfil de ${authorUsername}`} className={styles.profilePic} />
          <span className={styles.username}>{authorUsername}</span>
        </Link>
        {canDelete && (
          <IoTrashOutline onClick={handleDelete} className={`${styles.actionIcon} ${styles.deleteIcon}`} title="Eliminar publicación" />
        )}
      </div>
      <div className={styles.postImageContainer}>
        <img src={postData.media_url} alt={`publicación de ${authorUsername}`} className={styles.postImage} />
      </div>
      <div className={styles.postActions}>
        <div className={styles.mainActions}>
          {isLiked ? (
            <IoHeart onClick={handleLike} className={`${styles.actionIcon} ${styles.liked}`} />
          ) : (
            <IoHeartOutline onClick={handleLike} className={styles.actionIcon} />
          )}
          <IoChatbubbleOutline className={styles.actionIcon} />
          <IoPaperPlaneOutline className={styles.actionIcon} />
        </div>
        <div className={styles.bookmarkAction}><IoBookmarkOutline className={styles.actionIcon} /></div>
      </div>
      <div className={styles.postInfo}>
        <p className={styles.likes}>{likesCount} me gusta</p>
        <p className={styles.description}>
          <Link to={`/${authorUsername}`} className={styles.usernameLink}>{authorUsername}</Link>
          {' '}
          {postData.text_content}
        </p>
        {comments.length > 0 && (
          <div className={styles.commentsSection}>
            <button onClick={() => setShowComments(!showComments)} className={styles.toggleComments}>
              {showComments ? 'Ocultar comentarios' : `Ver los ${comments.length} comentarios`}
            </button>
            {showComments && (
              <div className={styles.commentList}>
                {comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <Link to={`/${comment.profiles.username}`} className={styles.usernameLink}>
                      {comment.profiles.username}
                    </Link>
                    <span>{comment.comment_text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <AddCommentForm postId={postData.id} onNewComment={handleNewComment} />
    </article>
  );
}

export default Post;