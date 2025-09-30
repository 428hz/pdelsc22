import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";

interface AddCommentFormProps {
  postId: string | number;
  onNewComment: (comment: any) => void;
}

export default function AddCommentForm({ postId, onNewComment }: AddCommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          comment_text: commentText.trim(),
        })
        .select(`*, profiles (username, avatar_url)`)
        .single();

      if (error) throw error;
      
      onNewComment(data);
      setCommentText('');
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo publicar el comentario: ' + error.message);
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.commentForm}>
      <TextInput
        style={styles.commentInput}
        placeholder="Añade un comentario..."
        placeholderTextColor="#8e8e8e"
        value={commentText}
        onChangeText={setCommentText}
        onSubmitEditing={handleSubmit}
        returnKeyType="send"
        editable={!!user && !isSubmitting}
      />
      <TouchableOpacity 
        onPress={handleSubmit} 
        style={[styles.submitButton, (!commentText.trim() || isSubmitting) && styles.submitButtonDisabled]} 
        disabled={isSubmitting || !commentText.trim()}
      >
        <Text style={[styles.submitButtonText, isSubmitting && styles.submitButtonTextDisabled]}>
          {isSubmitting ? '...' : 'Publicar'}
        </Text>
      </TouchableOpacity>
    </View>
      
  );
}

const styles = StyleSheet.create({
  commentForm: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#363636',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    padding: 8,
  },
  submitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#0095f6',
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#8e8e8e',
  }
  
});
