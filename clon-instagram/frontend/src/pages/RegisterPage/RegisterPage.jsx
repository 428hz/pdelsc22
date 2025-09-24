import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { supabase } from '../../supabaseClient.js';
import toast from 'react-hot-toast'; // Importamos toast

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { 
            username: username,
          }
        }
      });

      if (error) throw error;
      
      toast.success('¡registro exitoso! revisa tu correo para confirmar.');
      navigate('/login');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>instagram</h1>
        <p className={styles.subtitle}>
          regístrate para ver fotos y videos de tus amigos.
        </p>
        <form onSubmit={handleRegister} className={styles.form}>
          <input 
            type="email" 
            placeholder="correo electrónico" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="nombre de usuario" 
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="contraseña" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'registrando...' : 'registrarte'}
          </button>
        </form>
        <p className={styles.loginText}>
          ¿tienes una cuenta? <Link to="/login" className={styles.loginLink}>inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;