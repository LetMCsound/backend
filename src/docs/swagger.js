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
        Sound: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            artist: { type: 'string' },
            genre: { type: 'string' },
            section: { type: 'string' },
            bpm: { type: 'integer' },
            key: { type: 'string' },
            scale: { type: 'string' },
            cover_url: { type: 'string' },
            audio_url: { type: 'string' },
            description: { type: 'string' },
            likes: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Lyric: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            artist: { type: 'string' },
            genre: { type: 'string' },
            cover_url: { type: 'string' },
            preview: { type: 'string' },
            full_text: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Musician: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            role: { type: 'string' },
            genre: { type: 'string' },
            avatar_url: { type: 'string' },
            banner_url: { type: 'string' },
            bio: { type: 'string' },
            followers: { type: 'string' },
            beats: { type: 'integer' },
            songs: { type: 'integer' },
            verified: { type: 'boolean' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)
