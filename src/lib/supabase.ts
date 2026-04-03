import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL oder Anon Key fehlen in den Umgebungsvariablen. Datenbankverbindung wird nicht funktionieren.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: {}, error: new Error('Supabase nicht konfiguriert') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ order: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase nicht konfiguriert') }) }),
        insert: () => Promise.resolve({ error: new Error('Supabase nicht konfiguriert') }),
      })
    } as any;
