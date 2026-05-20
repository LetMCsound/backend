import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

// Cliente público (anon key) — para operaciones normales
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

// Cliente con permisos elevados (service role) — solo para admin / cron
// Úsalo con cuidado: bypasa RLS
export const supabaseAdmin = config.supabase.serviceRoleKey
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null
