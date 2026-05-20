import { Router } from 'express'
import { lyricsController } from '../controllers/lyricsController.js'
import { lyricsSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/lyrics:
 *   get:
 *     summary: Lista todas las letras
 *     tags: [Lyrics]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array de letras }
 */
router.get('/', lyricsController.list)

/**
 * @swagger
 * /api/lyrics/{id}:
 *   get:
 *     summary: Detalle de una letra
 *     tags: [Lyrics]
 *     responses:
 *       200: { description: Letra encontrada }
 *       404: { description: No encontrada }
 */
router.get('/:id', lyricsController.detail)

/**
 * @swagger
 * /api/lyrics:
 *   post:
 *     summary: Publica una nueva letra
 *     tags: [Lyrics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Letra creada }
 */
router.post('/', requireAuth, validate(lyricsSchemas.create), lyricsController.create)

router.delete('/:id', requireAuth, lyricsController.remove)

export default router
