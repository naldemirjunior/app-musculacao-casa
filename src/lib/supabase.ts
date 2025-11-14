import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validar se as credenciais estão configuradas
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '!090598#' || supabaseAnonKey === '!090598#') {
  console.warn('⚠️ Credenciais do Supabase não configuradas corretamente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
