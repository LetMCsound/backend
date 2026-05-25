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

// ── Seguridad ──
app.use(helmet({
  crossOriginResourcePolicy: false
}))

// ── CORS (Capacitor + navegador + localhost) ──
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ── Parsers ──
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logs ──
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

// ── Rate limiting ──
// Rutas públicas: generoso (lectura de catálogo)
const publicLimiter = rateLimit({
  windowMs: 60_000,   // 1 minuto
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde' }
})
// Rutas sensibles: auth, compras, subidas
const strictLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde' }
})

app.use('/api/beats',         publicLimiter)
app.use('/api/lyrics',        publicLimiter)
app.use('/api/musicians',     publicLimiter)
app.use('/api/film',          publicLimiter)
app.use('/api/graphic',       publicLimiter)
app.use('/api/comments',      publicLimiter)
app.use('/api/notifications', publicLimiter)
app.use('/api/auth',          strictLimiter)
app.use('/api/ventas',        strictLimiter)
app.use('/api/contratos',     strictLimiter)

// ── Swagger ──
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'LetMCsound API Docs',
    customCss: '.swagger-ui .topbar { background: #b259ff; }'
  })
)

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec)
})

// ── API Routes ──
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

// ── Errores ──
app.use(notFound)
app.use(errorHandler)

export default app