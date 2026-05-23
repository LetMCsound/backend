import { Router } from 'express'
import { lyricsController } from '../controllers/lyricsController.js'
import { lyricsSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Lyrics
 *   description: Gestión de letras de canciones
 */

/**
 * @swagger
 * /api/lyrics:
 *   get:
 *     summary: Lista letras publicadas
 *     tags: [Lyrics]
 *     parameters:
 *       - { in: query, name: genre,    schema: { type: string } }
 *       - { in: query, name: language, schema: { type: string, example: es } }
 *       - { in: query, name: limit,    schema: { type: integer, default: 50 } }
 *     responses:
 *       200: { description: Array de letras }
 */
router.get('/', lyricsController.list)

/**
 * @swagger
 * /api/lyrics/search:
 *   get:
 *     summary: Búsqueda textual de letras
 *     tags: [Lyrics]
 *     parameters:
 *       - { in: query, name: q, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Letras encontradas }
 */
router.get('/search', lyricsController.search)

/**
 * @swagger
 * /api/lyrics/seller/{sellerId}:
 *   get:
 *     summary: Letras de un vendedor
 *     tags: [Lyrics]
 *     responses:
 *       200: { description: Array de letras }
 */
router.get('/seller/:sellerId', lyricsController.bySeller)

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

router.put('/:id', requireAuth, validate(lyricsSchemas.update), lyricsController.update)
router.delete('/:id', requireAuth, lyricsController.remove)

export default router
