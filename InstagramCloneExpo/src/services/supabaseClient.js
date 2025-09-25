import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Creamos un adaptador de almacenamiento "inteligente"
const CustomStorageAdapter = {
  getItem: (key) => {
    // Si NO estamos en un navegador (es decir, en el móvil), usamos AsyncStorage
    if (Platform.OS !== 'web') {
      return AsyncStorage.getItem(key);
    }
    // Si estamos en un navegador, usamos localStorage (si está disponible)
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    // Si estamos en el servidor (donde window no existe), no hacemos nada
    return null;
  },
  setItem: (key, value) => {
    if (Platform.OS !== 'web') {
      AsyncStorage.setItem(key, value);
    } else if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (Platform.OS !== 'web') {
      AsyncStorage.removeItem(key);
    } else if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
};

// Creamos el cliente de Supabase usando nuestro adaptador universal
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: CustomStorageAdapter, // Usamos nuestro adaptador personalizado
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});