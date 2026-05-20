import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LetMCsound API',
      version: '1.0.0',
      description: 'REST API para la plataforma de música LetMCsound. Proyecto Intermodular de Grado Superior.',
      contact: { name: 'Martín', email: 'contacto@letmcsound.com' },
      license: { name: 'MIT' }
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido al hacer login. Formato: Bearer {token}'
        }
      },
      schemas: {
        Beat: {
          type: 'object',
          properties: {
            id:                { type: 'string', format: 'uuid' },
            created_at:        { type: 'string', format: 'date-time' },
            seller_id:         { type: 'string', format: 'uuid' },
            seller_name:       { type: 'string' },
            title:             { type: 'string' },
            description:       { type: 'string' },
            genre:             { type: 'string' },
            type:              { type: 'string', enum: ['Beat', 'Song', 'Sample', 'Pack'] },
            bpm:               { type: 'integer' },
            key:               { type: 'string' },
            scale:             { type: 'string' },
            release_date:      { type: 'string' },
            cover_url:         { type: 'string' },
            audio_preview_url: { type: 'string' },
            likes:             { type: 'integer' },
            plays:             { type: 'integer' },
            price_standard:    { type: 'number' },
            price_premium:     { type: 'number' },
            price_exclusive:   { type: 'number' },
            tags:              { type: 'array', items: { type: 'string' } },
            is_published:      { type: 'boolean' }
          }
        },
        Lyric: {
          type: 'object',
          properties: {
            id:              { type: 'string', format: 'uuid' },
            seller_id:       { type: 'string', format: 'uuid' },
            seller_name:     { type: 'string' },
            title:           { type: 'string' },
            description:     { type: 'string' },
            genre:           { type: 'string' },
            language:        { type: 'string' },
            content:         { type: 'string' },
            cover_url:       { type: 'string' },
            tags:            { type: 'array', items: { type: 'string' } },
            price_standard:  { type: 'number' },
            price_premium:   { type: 'number' },
            price_exclusive: { type: 'number' },
            likes:           { type: 'integer' },
            is_published:    { type: 'boolean' },
            created_at:      { type: 'string', format: 'date-time' }
          }
        },
        Musician: {
          type: 'object',
          properties: {
            id:              { type: 'string', format: 'uuid' },
            user_id:         { type: 'string', format: 'uuid' },
            name:            { type: 'string' },
            slug:            { type: 'string' },
            bio:             { type: 'string' },
            location:        { type: 'string' },
            avatar_url:      { type: 'string' },
            cover_url:       { type: 'string' },
            categories:      { type: 'array', items: { type: 'string' } },
            link_youtube:    { type: 'string' },
            link_soundcloud: { type: 'string' },
            link_instagram:  { type: 'string' },
            link_spotify:    { type: 'string' },
            followers:       { type: 'integer' },
            total_beats:     { type: 'integer' },
            is_verified:     { type: 'boolean' },
            is_published:    { type: 'boolean' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error:   { type: 'string' },
            details: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Token no proporcionado o inválido',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
        },
        BadRequest: {
          description: 'Datos inválidos',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)
