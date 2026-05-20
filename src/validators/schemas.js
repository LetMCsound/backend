import Joi from 'joi'

export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8)
      .pattern(/[A-Z]/, 'mayúscula')
      .pattern(/[0-9]/, 'número')
      .pattern(/[^A-Za-z0-9]/, 'símbolo')
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.name': 'La contraseña debe incluir al menos un/a {#name}'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}

export const soundSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    artist: Joi.string().max(200).allow(''),
    genre: Joi.string().max(50).allow(''),
    section: Joi.string().max(100).allow(''),
    bpm: Joi.number().integer().min(40).max(300).allow(null),
    key: Joi.string().max(50).allow(''),
    scale: Joi.string().max(50).allow(''),
    cover_url: Joi.string().uri().allow(''),
    audio_url: Joi.string().uri().allow(''),
    description: Joi.string().max(2000).allow(''),
    likes: Joi.number().integer().min(0).default(0)
  }),
  update: Joi.object({
    title: Joi.string().min(1).max(200),
    artist: Joi.string().max(200),
    genre: Joi.string().max(50),
    section: Joi.string().max(100),
    bpm: Joi.number().integer().min(40).max(300),
    key: Joi.string().max(50),
    scale: Joi.string().max(50),
    cover_url: Joi.string().uri(),
    audio_url: Joi.string().uri(),
    description: Joi.string().max(2000),
    likes: Joi.number().integer().min(0)
  }).min(1)
}

export const lyricsSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    artist: Joi.string().max(200).allow(''),
    genre: Joi.string().max(50).allow(''),
    cover_url: Joi.string().uri().allow(''),
    preview: Joi.string().max(500).allow(''),
    full_text: Joi.string().max(10000).required()
  })
}

export const ventaSchemas = {
  create: Joi.object({
    titulo_beat: Joi.string().required(),
    precio: Joi.number().positive().required(),
    licencia: Joi.string().valid('Standard', 'Premium', 'Exclusiva').required()
  })
}

export const contratoSchemas = {
  generar: Joi.object({
    titulo: Joi.string().required(),
    precio: Joi.number().positive().required(),
    licencia: Joi.string().valid('Standard', 'Premium', 'Exclusiva').required()
  })
}
