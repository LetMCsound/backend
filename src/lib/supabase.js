import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

/**
 * Cliente público (anon key) — solo para reads que respetan RLS público.
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

/**
 * Crea un cliente Supabase autenticado como el usuario que hizo la petición.
 * Necesario para escrituras (insert/update/delete) ya que las RLS verifican
 * auth.uid() = seller_id / user_id.
 */
export function userClient(token) {
  if (!token) return supabase
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

/**
 * Cliente con permisos elevados (service role) — bypassa RLS.
 * Solo usar para tareas admin o crons. Requiere SUPABASE_SERVICE_ROLE_KEY.
 */
export const supabaseAdmin = config.supabase.serviceRoleKey
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null
