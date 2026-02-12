// KISS: Simple, single responsibility
// SOLID: Dependency Inversion - depends on env vars, not hardcoded values
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      // Define your table types here
    }
  }
}

export function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}
