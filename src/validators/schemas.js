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
    slug:            Joi.string().max(100).pattern(/^[a-z0-9-]+$/).allow('', null),
    bio:             Joi.string().max(2000).allow('', null),
    location:        Joi.string().max(200).allow('', null),
    avatar_url:      Joi.string().uri().allow('', null),
    cover_url:       Joi.string().uri().allow('', null),
    categories:      Joi.array().items(Joi.string().max(50)).allow(null),
    // Los enlaces sociales aceptan URL completa o solo el handle (@user)
    link_youtube:    Joi.string().max(500).allow('', null),
    link_soundcloud: Joi.string().max(500).allow('', null),
    link_instagram:  Joi.string().max(500).allow('', null),
    link_spotify:    Joi.string().max(500).allow('', null)
  }).min(1)
}

export const favoriteSchemas = {
  add: Joi.object({
    contentId:   Joi.string().required(),
    contentType: Joi.string().valid('beat', 'lyric', 'film', 'graphic', 'musician').required()
  })
}

export const commentSchemas = {
  create: Joi.object({
    contentId:   Joi.string().required(),
    contentType: Joi.string().valid('beat', 'lyric', 'film', 'graphic', 'musician').required(),
    text:        Joi.string().min(1).max(2000).required()
  })
}

export const notificationSchemas = {
  create: Joi.object({
    userId:         Joi.string().required(),
    type:           Joi.string().required(),
    title:          Joi.string().max(200).required(),
    body:           Joi.string().max(1000).allow(''),
    conversationId: Joi.string().allow(null, '')
  })
}

export const chatSchemas = {
  getOrCreate: Joi.object({
    sellerId:     Joi.string().required(),
    sellerName:   Joi.string().required(),
    productId:    Joi.string().allow(null, ''),
    productType:  Joi.string().valid('beat', 'lyric', 'film', 'graphic').allow(null, ''),
    productTitle: Joi.string().allow(null, '')
  }),
  updateStatus: Joi.object({
    status:     Joi.string().valid('open', 'accepted', 'completed', 'cancelled').required(),
    finalPrice: Joi.number().positive().allow(null)
  }),
  signContract: Joi.object({
    role: Joi.string().valid('buyer', 'seller').required()
  }),
  sendMessage: Joi.object({
    content:     Joi.string().min(1).max(2000).required(),
    type:        Joi.string().valid('text', 'offer').default('text'),
    offerAmount: Joi.number().positive().allow(null)
  }),
  respondOffer: Joi.object({
    status:         Joi.string().valid('accepted', 'rejected').required(),
    conversationId: Joi.string().required(),
    amount:         Joi.number().positive().required()
  })
}

export const filmSchemas = {
  create: Joi.object({
    title:           Joi.string().min(1).max(200).required(),
    description:     Joi.string().max(2000).allow('', null),
    genre:           Joi.string().max(100).allow('', null),
    cover_url:       Joi.string().uri().allow('', null),
    video_url:       Joi.string().uri().allow('', null),
    price_standard:  Joi.number().positive().precision(2).default(49.99),
    price_premium:   Joi.number().positive().precision(2).default(99.99),
    price_exclusive: Joi.number().positive().precision(2).default(299.99),
    tags:            Joi.array().items(Joi.string().max(50)).default([]),
    is_published:    Joi.boolean().default(true)
  }),
  update: Joi.object({
    title:           Joi.string().min(1).max(200),
    description:     Joi.string().max(2000).allow(''),
    genre:           Joi.string().max(100).allow(''),
    cover_url:       Joi.string().uri().allow(''),
    video_url:       Joi.string().uri().allow(''),
    price_standard:  Joi.number().positive().precision(2),
    price_premium:   Joi.number().positive().precision(2),
    price_exclusive: Joi.number().positive().precision(2),
    tags:            Joi.array().items(Joi.string().max(50)),
    is_published:    Joi.boolean()
  }).min(1)
}

export const graphicSchemas = {
  create: Joi.object({
    title:           Joi.string().min(1).max(200).required(),
    description:     Joi.string().max(2000).allow('', null),
    style:           Joi.string().max(100).allow('', null),
    cover_url:       Joi.string().uri().allow('', null),
    price_standard:  Joi.number().positive().precision(2).default(14.99),
    price_premium:   Joi.number().positive().precision(2).default(39.99),
    price_exclusive: Joi.number().positive().precision(2).default(99.99),
    tags:            Joi.array().items(Joi.string().max(50)).default([]),
    is_published:    Joi.boolean().default(true)
  }),
  update: Joi.object({
    title:           Joi.string().min(1).max(200),
    description:     Joi.string().max(2000).allow(''),
    style:           Joi.string().max(100).allow(''),
    cover_url:       Joi.string().uri().allow(''),
    price_standard:  Joi.number().positive().precision(2),
    price_premium:   Joi.number().positive().precision(2),
    price_exclusive: Joi.number().positive().precision(2),
    tags:            Joi.array().items(Joi.string().max(50)),
    is_published:    Joi.boolean()
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
