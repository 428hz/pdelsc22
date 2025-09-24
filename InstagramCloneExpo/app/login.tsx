import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../src/services/supabaseClient'; // Importamos supabase

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Esta función es casi idéntica a la que tenías en la web
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message); // Usamos Alert para mostrar errores en el móvil
    }
    // Si el login es exitoso, el AuthContext se encargará de redirigirnos automáticamente.
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instagram</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail} // En móvil se usa onChangeText
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Para ocultar la contraseña
      />
      
      <Button
        title={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

// Así se manejan los estilos en React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontFamily: 'System', // Usaremos fuentes del sistema por ahora
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#363636',
    borderRadius: 5,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
});