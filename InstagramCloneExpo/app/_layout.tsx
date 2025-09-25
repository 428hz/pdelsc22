import 'react-native-url-polyfill/auto';
import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function Layout() {
  const { session, loading } = useAuth();

  // Mientras se verifica la sesión, no mostramos nada para evitar
  // que se renderice una pantalla incorrecta. El AuthContext ya muestra
  // el texto "Cargando sesión...".
  if (loading) {
    return null; 
  }

  // Si no hay sesión, redirigimos explícitamente a la pantalla de login.
  if (!session) {
    return <Redirect href="/login" />;
  }

  // Si hay sesión, mostramos el grupo de pestañas como la única opción.
  // Esto le quita el control a Expo Router y evita que cree la barra inferior.
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}