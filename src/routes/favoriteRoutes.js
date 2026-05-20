import { Router } from 'express'
import { favoriteController } from '../controllers/favoriteController.js'
import { favoriteSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Gestión de favoritos del usuario
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lista mis favoritos
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: contentType, schema: { type: string, enum: [beat, lyric, film, graphic, musician] } }
 *     responses:
 *       200: { description: Array de favoritos }
 */
router.get('/', requireAuth, favoriteController.myFavorites)

/**
 * @swagger
 * /api/favorites/check/{contentId}:
 *   get:
 *     summary: Comprueba si un contenido está en mis favoritos
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: { isFavorite: bool } }
 */
router.get('/check/:contentId', requireAuth, favoriteController.check)

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Añade a favoritos
 *     tags: [Favorites]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Añadido }
 */
router.post('/', requireAuth, validate(favoriteSchemas.add), favoriteController.add)

router.delete('/:contentId', requireAuth, favoriteController.remove)

export default router
