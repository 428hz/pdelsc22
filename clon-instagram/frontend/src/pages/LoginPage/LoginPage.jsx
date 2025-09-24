import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { supabase } from '../../supabaseClient.js';
import toast from 'react-hot-toast'; // Importamos toast

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      navigate('/');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>instagram</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="email" 
            placeholder="correo electrónico" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="contraseña" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'iniciando sesión...' : 'iniciar sesión'}
          </button>
        </form>
        <div className={styles.separator}>
            <div className={styles.line}></div><span className={styles.or}>o</span><div className={styles.line}></div>
        </div>
        <p className={styles.registerText}>
          ¿no tienes una cuenta? <Link to="/register" className={styles.registerLink}>regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;