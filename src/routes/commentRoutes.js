import { Router } from 'express'
import { commentController } from '../controllers/commentController.js'
import { commentSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comentarios sobre beats, lyrics, films, etc.
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Lista comentarios de un contenido
 *     tags: [Comments]
 *     parameters:
 *       - { in: query, name: contentId,   required: true, schema: { type: string } }
 *       - { in: query, name: contentType, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Array de comentarios }
 */
router.get('/', commentController.list)

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Añade un comentario
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Comentario creado }
 */
router.post('/', requireAuth, validate(commentSchemas.create), commentController.create)

router.delete('/:id', requireAuth, commentController.remove)

export default router
