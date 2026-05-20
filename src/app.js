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
app.use(cors({ origin: config.cors.origin, credentials: true }))
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
