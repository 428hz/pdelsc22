import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView,
  Platform // Para ajustes específicos de la plataforma
} from 'react-native';
import { supabase } from '../src/services/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 1. Reemplazamos `useNavigate` por `useRouter`

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      // Si el login es exitoso, te redirige a la pantalla principal.
      // `replace` evita que el usuario pueda "volver atrás" a la pantalla de login.
      router.replace('/');

    } catch (error: any) {
      // 2. Reemplazamos `toast` por una alerta nativa.
      Alert.alert('Error de Inicio de Sesión', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. `SafeAreaView` es como el `div` principal, pero evita que el contenido se superponga con la barra de estado o el "notch" del teléfono.
    <SafeAreaView style={styles.container}>
     <View style={styles.loginBox}>
        {/* Usamos <Text> para todo el texto, no hay h1, p, etc. */}
        <Text style={styles.title}>Instagram</Text>
        
        {/* 4. El `<form>` ahora es un `<View>`. No existe `onSubmit`. */}
        <View style={styles.form}>
          {/* 5. El `<input>` ahora es `<TextInput>`. */}
          <TextInput 
            placeholder="Correo electrónico" 
            style={styles.input}
            value={email}
            onChangeText={setEmail} // `onChange` se convierte en `onChangeText`. Es más directo.
            keyboardType="email-address" // Le dice al teléfono que muestre un teclado para emails.
            autoCapitalize="none"
            placeholderTextColor="#a8a8a8"
          />
          <TextInput 
            placeholder="Contraseña" 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Oculta los caracteres de la contraseña.
            placeholderTextColor="#a8a8a8"
          />
          {/* 6. El `<button>` ahora es `<TouchableOpacity>`, que es un botón personalizable. */}
          <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.or}>o</Text>
            <View style={styles.line} />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta?{' '}
          </Text>
          {/* 7. El `<Link>` de Expo Router necesita un `href` y debe envolver un componente tocable. */}
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 8. TODO tu CSS se traduce a un objeto JavaScript usando `StyleSheet.create`.
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Esto hace que el contenedor ocupe toda la pantalla.
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  loginBox: { 
    width: '90%', 
    maxWidth: 350, 
    backgroundColor: '#000', 
    borderWidth: 1, 
    borderColor: '#363636', 
    borderRadius: 8, 
    padding: 25, 
    alignItems: 'center' 
  },
  title: { 
    // Para usar 'Grand Hotel', necesitarás cargar la fuente en tu proyecto Expo.
    // Por ahora, usaremos una fuente de sistema.
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-condensed',
    fontSize: 48, 
    color: 'white', 
    marginBottom: 30 
  },
  form: { 
    width: '100%', 
    gap: 10 
  },
  input: { 
    backgroundColor: '#1e1e1e', 
    borderWidth: 1, 
    borderColor: '#363636', 
    borderRadius: 5, 
    padding: 12, 
    color: 'white', 
    fontSize: 14 
  },
  button: { 
    backgroundColor: '#0095f6', 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  separator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginVertical: 20, 
    gap: 15 
  },
  line: { 
    height: 1, 
    flex: 1, 
    backgroundColor: '#363636' 
  },
  or: { 
    color: '#a8a8a8', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  registerContainer: { 
    flexDirection: 'row' 
  },
  registerText: { 
    fontSize: 14, 
    color: 'white' 
  },
  registerLink: { 
    color: '#0095f6', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});