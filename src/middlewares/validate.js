/**
 * Middleware genérico para validar req.body con un schema de Joi.
 * Uso: router.post('/sounds', validate(soundSchema), controller)
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details.map(d => d.message)
      })
    }
    req.body = value
    next()
  }
}
