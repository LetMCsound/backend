import { Router } from 'express'
import authRoutes from './authRoutes.js'
import soundRoutes from './soundRoutes.js'
import lyricsRoutes from './lyricsRoutes.js'
import musicianRoutes from './musicianRoutes.js'
import ventaRoutes from './ventaRoutes.js'
import contratoRoutes from './contratoRoutes.js'

const router = Router()

router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

router.use('/auth', authRoutes)
router.use('/sounds', soundRoutes)
router.use('/lyrics', lyricsRoutes)
router.use('/musicians', musicianRoutes)
router.use('/ventas', ventaRoutes)
router.use('/contratos', contratoRoutes)

export default router
