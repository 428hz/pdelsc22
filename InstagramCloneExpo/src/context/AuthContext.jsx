import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.js';
import { Text, View } from 'react-native';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Iniciamos en true

  useEffect(() => {
    // Esta función se ejecutará una sola vez al inicio
    const fetchSession = async () => {
      try {
        // 1. Preguntamos activamente a Supabase por la sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // Si hay sesión, buscamos el perfil
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData || null);
        }
      } catch (error) {
        console.error('Error al obtener la sesión inicial:', error);
      } finally {
        // 2. Termine bien o mal, dejamos de cargar
        setLoading(false);
      }
    };

    fetchSession();

    // 3. Mantenemos el listener para cambios FUTUROS (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // También actualizamos el perfil cuando cambia la sesión
        if (session?.user) {
          supabase.from('profiles').select('*').eq('id', session.user.id).single()
            .then(({ data: profileData }) => setProfile(profileData || null));
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user,
    profile,
    signOut: () => supabase.auth.signOut(),
    loading,
  };

  // El componente de carga ahora solo se muestra al inicio
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando sesión...</Text>
      </View>
    );
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}