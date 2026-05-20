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

export const beatSchemas = {
  create: Joi.object({
    title:             Joi.string().min(1).max(200).required(),
    description:       Joi.string().max(2000).allow('', null),
    genre:             Joi.string().max(100).allow('', null),
    type:              Joi.string().valid('Beat', 'Song', 'Sample', 'Pack').default('Beat'),
    bpm:               Joi.number().integer().min(40).max(300).allow(null),
    key:               Joi.string().max(50).allow('', null),
    scale:             Joi.string().max(50).allow('', null),
    release_date:      Joi.string().max(50).allow('', null),
    cover_url:         Joi.string().uri().allow('', null),
    audio_preview_url: Joi.string().uri().allow('', null),
    price_standard:    Joi.number().positive().precision(2).default(29.99),
    price_premium:     Joi.number().positive().precision(2).default(79.99),
    price_exclusive:   Joi.number().positive().precision(2).default(199.99),
    tags:              Joi.array().items(Joi.string().max(50)).default([]),
    is_published:      Joi.boolean().default(true)
  }),
  update: Joi.object({
    title:             Joi.string().min(1).max(200),
    description:       Joi.string().max(2000).allow(''),
    genre:             Joi.string().max(100).allow(''),
    type:              Joi.string().valid('Beat', 'Song', 'Sample', 'Pack'),
    bpm:               Joi.number().integer().min(40).max(300),
    key:               Joi.string().max(50).allow(''),
    scale:             Joi.string().max(50).allow(''),
    release_date:      Joi.string().max(50).allow(''),
    cover_url:         Joi.string().uri().allow(''),
    audio_preview_url: Joi.string().uri().allow(''),
    price_standard:    Joi.number().positive().precision(2),
    price_premium:     Joi.number().positive().precision(2),
    price_exclusive:   Joi.number().positive().precision(2),
    tags:              Joi.array().items(Joi.string().max(50)),
    is_published:      Joi.boolean()
  }).min(1)
}

export const lyricsSchemas = {
  create: Joi.object({
    title:           Joi.string().min(1).max(200).required(),
    description:     Joi.string().max(2000).allow('', null),
    genre:           Joi.string().max(100).allow('', null),
    language:        Joi.string().max(10).default('es'),
    content:         Joi.string().max(20000).required(),
    cover_url:       Joi.string().uri().allow('', null),
    tags:            Joi.array().items(Joi.string().max(50)).default([]),
    price_standard:  Joi.number().positive().precision(2).default(19.99),
    price_premium:   Joi.number().positive().precision(2).default(49.99),
    price_exclusive: Joi.number().positive().precision(2).default(149.99),
    is_published:    Joi.boolean().default(true)
  }),
  update: Joi.object({
    title:           Joi.string().min(1).max(200),
    description:     Joi.string().max(2000).allow(''),
    genre:           Joi.string().max(100).allow(''),
    language:        Joi.string().max(10),
    content:         Joi.string().max(20000),
    cover_url:       Joi.string().uri().allow(''),
    tags:            Joi.array().items(Joi.string().max(50)),
    price_standard:  Joi.number().positive().precision(2),
    price_premium:   Joi.number().positive().precision(2),
    price_exclusive: Joi.number().positive().precision(2),
    is_published:    Joi.boolean()
  }).min(1)
}

export const musicianSchemas = {
  update: Joi.object({
    name:            Joi.string().min(1).max(200),
    slug:            Joi.string().max(100).pattern(/^[a-z0-9-]+$/),
    bio:             Joi.string().max(2000).allow(''),
    location:        Joi.string().max(200).allow(''),
    avatar_url:      Joi.string().uri().allow(''),
    cover_url:       Joi.string().uri().allow(''),
    categories:      Joi.array().items(Joi.string().max(50)),
    link_youtube:    Joi.string().uri().allow(''),
    link_soundcloud: Joi.string().uri().allow(''),
    link_instagram:  Joi.string().uri().allow(''),
    link_spotify:    Joi.string().uri().allow('')
  }).min(1)
}

export const ventaSchemas = {
  create: Joi.object({
    titulo_beat: Joi.string().required(),
    precio:      Joi.number().positive().required(),
    licencia:    Joi.string().valid('Standard', 'Premium', 'Exclusiva').required()
  })
}

export const contratoSchemas = {
  generar: Joi.object({
    titulo:   Joi.string().required(),
    precio:   Joi.number().positive().required(),
    licencia: Joi.string().valid('Standard', 'Premium', 'Exclusiva').required()
  })
}
