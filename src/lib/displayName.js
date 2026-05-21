import { musicianService } from '../services/musicianService.js'

/**
 * Obtiene el nombre a mostrar de un usuario, priorizando:
 *   1. profile.name de la tabla musicians (perfil actualizado)
 *   2. user_metadata.name de Supabase Auth
 *   3. username del email
 *   4. 'Usuario' como fallback
 *
 * Se usa para asegurar que las publicaciones, comentarios y mensajes
 * reflejen el nombre actual del usuario (no el del momento de registro).
 */
export async function getDisplayName(user) {
  if (!user) return 'Usuario'
  try {
    const profile = await musicianService.getByUserId(user.id)
    if (profile?.name) return profile.name
  } catch { /* perfil aún no creado */ }
  return user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario'
}
