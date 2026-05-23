import { Router } from 'express'
import { filmController } from '../controllers/filmController.js'
import { filmSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Producciones audiovisuales
 */

/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Lista de films publicados
 *     tags: [Films]
 *     responses:
 *       200: { description: Array de films }
 */
router.get('/', filmController.list)

router.get('/search', filmController.search)
router.get('/seller/:sellerId', filmController.bySeller)
router.get('/:id', filmController.detail)

router.post('/', requireAuth, validate(filmSchemas.create), filmController.create)
router.put('/:id', requireAuth, validate(filmSchemas.update), filmController.update)
router.delete('/:id', requireAuth, filmController.remove)
router.post('/:id/view', filmController.view)

export default router
