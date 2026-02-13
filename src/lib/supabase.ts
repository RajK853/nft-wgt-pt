// KISS: Simple, single responsibility
// SOLID: Dependency Inversion - depends on env vars, not hardcoded values
import { createClient } from '@supabase/supabase-js'

// Using any for simplicity - Supabase client works without strict typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseClient = any

export function createSupabaseClient() {
  // Debug: Log all env vars available
  console.log('[Supabase] Available env vars:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : undefined,
  })

  // Support both VITE_ and NEXT_PUBLIC_ prefixed env vars
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing env vars - supabaseUrl:', supabaseUrl, 'supabaseAnonKey:', supabaseAnonKey ? '***' : undefined)
    throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }

  console.log('[Supabase] Client initialized successfully')


  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

