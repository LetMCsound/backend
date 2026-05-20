import { supabase } from '../lib/supabase.js'

/**
 * Middleware que verifica el JWT de Supabase en el header Authorization.
 * Si es válido, añade req.user al request y pasa al siguiente middleware.
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
    next()
  } catch (err) {
    next(err)
  }
}

/**
 * Middleware opcional: añade req.user si hay token válido, pero no bloquea.
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
    }
  } catch {
    // ignorar — la sesión es opcional
  }
  next()
}
