import { supabase, userClient } from '../lib/supabase.js'

/**
 * Verifica el JWT de Supabase y adjunta:
 *   req.user      → datos del usuario
 *   req.token     → JWT raw
 *   req.supabase  → cliente Supabase autenticado como ese usuario
 *                   (úsalo en services para que RLS funcione)
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }

    req.user = user
    req.token = token
    req.supabase = userClient(token)
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Igual que requireAuth pero no bloquea si no hay token.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next()

  try {
    const token = authHeader.slice(7)
    const { data: { user } } = await supabase.auth.getUser(token)
    if (user) {
      req.user = user
      req.token = token
      req.supabase = userClient(token)
    }
  } catch {
    // ignorar — la sesión es opcional
  }
  next()
}
