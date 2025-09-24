import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Montado y listo para escuchar cambios de sesión.");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("--- CHECKPOINT 1: El listener de Supabase se activó ---");
        setSession(session);

        if (session?.user) {
          console.log(`--- CHECKPOINT 2: Hay un usuario. Buscando perfil para el ID: ${session.user.id} ---`);
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(); // Usamos maybeSingle() para más robustez
          
          if (error) {
            console.error("Error al buscar el perfil:", error);
          }
          console.log("--- CHECKPOINT 3: Respuesta de la base de datos ---", { profileData });
          setProfile(profileData || null);

        } else {
          setProfile(null);
        }
        
        console.log("--- CHECKPOINT 4: Llamando a setLoading(false) para terminar la carga. ---");
        setLoading(false);
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
  };

  if (loading) {
    return <div>cargando sesión...</div>;
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