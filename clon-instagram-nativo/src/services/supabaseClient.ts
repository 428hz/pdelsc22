import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupportedStorage } from '@supabase/supabase-js';

// 1. Creamos un almacenamiento "falso" para el servidor.
// No guarda nada, pero evita que la app crashee.
const ssrSafeStorage: SupportedStorage = {
  getItem: () => {
    return Promise.resolve(null);
  },
  setItem: () => {
    return Promise.resolve();
  },
  removeItem: () => {
    return Promise.resolve();
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 2. Usamos una condición para elegir el almacenamiento correcto.
    // `typeof window !== 'undefined'` solo es verdadero en el navegador o en el móvil.
    storage: typeof window !== 'undefined' ? AsyncStorage : ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});