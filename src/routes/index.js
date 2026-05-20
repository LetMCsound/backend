import { Router } from 'express'
import authRoutes from './authRoutes.js'
import beatRoutes from './beatRoutes.js'
import lyricsRoutes from './lyricsRoutes.js'
import musicianRoutes from './musicianRoutes.js'
import ventaRoutes from './ventaRoutes.js'
import contratoRoutes from './contratoRoutes.js'

const router = Router()

router.get('/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}))

router.use('/auth', authRoutes)
router.use('/beats', beatRoutes)
router.use('/lyrics', lyricsRoutes)
router.use('/musicians', musicianRoutes)
router.use('/ventas', ventaRoutes)
router.use('/contratos', contratoRoutes)

export default router
