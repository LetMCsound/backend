import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

import { config } from './config/env.js'
import routes from './routes/index.js'
import { swaggerSpec } from './docs/swagger.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'

const app = express()

// ── Seguridad y middlewares globales ──
app.use(helmet({ crossOriginResourcePolicy: false }))

/**
 * CORS dinámico:
 *   - CORS_ORIGIN puede ser una lista separada por comas: "https://a.com,https://b.com"
 *   - O un solo valor: "https://prod.com"
 *   - O "*" para permitir cualquier origen (solo recomendado en dev)
 *   - Además se permite cualquier subdominio *.vercel.app (preview deploys)
 */
const allowedOrigins = (config.cors.origin || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    // Permitir herramientas sin origin (curl, Postman, Swagger UI mismo dominio)
    if (!origin) return callback(null, true)

    // Wildcard absoluto
    if (allowedOrigins.includes('*')) return callback(null, true)

    // Coincidencia exacta
    if (allowedOrigins.includes(origin)) return callback(null, true)

    // Preview deploys de Vercel: https://frontend-xxx.vercel.app
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS: origen no permitido (${origin})`))
  },
  credentials: true
}))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

// ── Rate limiting ──
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde' }
})
app.use('/api', limiter)

// ── Swagger ──
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'LetMCsound API Docs',
  customCss: '.swagger-ui .topbar { background: #b259ff; }'
}))
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec))

// ── Rutas ──
app.use('/api', routes)

// ── Root ──
app.get('/', (req, res) => {
  res.json({
    name: 'LetMCsound API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health'
  })
})

// ── 404 y errores ──
app.use(notFound)
app.use(errorHandler)

export default app
