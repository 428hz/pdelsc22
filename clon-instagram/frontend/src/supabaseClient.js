import { createClient } from '@supabase/supabase-js'

// Obtenemos las variables de entorno de forma segura desde el archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- AÑADE ESTO PARA DEPURAR ---
console.log("URL leída desde .env:", supabaseUrl);
console.log("Anon Key leída desde .env:", supabaseAnonKey);
// --- FIN DE LA DEPURACIÓN ---

// Creamos y exportamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);