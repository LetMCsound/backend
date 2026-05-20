import { Router } from 'express'
import authRoutes from './authRoutes.js'
import beatRoutes from './beatRoutes.js'
import lyricsRoutes from './lyricsRoutes.js'
import musicianRoutes from './musicianRoutes.js'
import filmRoutes from './filmRoutes.js'
import graphicRoutes from './graphicRoutes.js'
import favoriteRoutes from './favoriteRoutes.js'
import commentRoutes from './commentRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import chatRoutes from './chatRoutes.js'
import ventaRoutes from './ventaRoutes.js'
import contratoRoutes from './contratoRoutes.js'

const router = Router()

router.get('/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}))

router.use('/auth',          authRoutes)
router.use('/beats',         beatRoutes)
router.use('/lyrics',        lyricsRoutes)
router.use('/musicians',     musicianRoutes)
router.use('/films',         filmRoutes)
router.use('/graphics',      graphicRoutes)
router.use('/favorites',     favoriteRoutes)
router.use('/comments',      commentRoutes)
router.use('/notifications', notificationRoutes)
router.use('/chat',          chatRoutes)
router.use('/ventas',        ventaRoutes)
router.use('/contratos',     contratoRoutes)

export default router
