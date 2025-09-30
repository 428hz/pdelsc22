import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// Este componente hijo se encarga de la lógica de redirección
const InitialLayout = () => {
  const { session, loading } = useAuth(); // Usamos 'loading' del contexto
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Si todavía está cargando la sesión, no hacemos nada para evitar parpadeos
    if (loading) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';

    // Si no hay sesión y el usuario está en una ruta protegida (dentro de tabs)
    if (!session && inTabsGroup) {
      router.replace('/login');
    } 
    // Si hay sesión y el usuario está fuera de las rutas protegidas (en login/register)
    else if (session && !inTabsGroup) {
      router.replace('/'); // Redirige a la ruta raíz del grupo (tabs)
    }
  }, [session, loading, segments]);

  // Mientras carga la sesión, podemos mostrar un splash screen o nada
  if (loading) {
    // Aquí podrías poner un indicador de carga si quisieras
    return null; 
  }

  return <Slot />; // <Slot /> renderiza la ruta actual (login o las pestañas)
};

// Este es el layout principal que se exporta
export default function RootLayout() {
  return (
    // El AuthProvider DEBE envolver todo desde el nivel más alto.
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}