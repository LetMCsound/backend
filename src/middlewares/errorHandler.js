/**
 * Middleware global de manejo de errores.
 * Debe registrarse al final de la cadena de middlewares.
 */
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err)

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

/**
 * Middleware para rutas no encontradas (404).
 */
export function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}
