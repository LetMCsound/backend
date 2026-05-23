import { Router } from 'express'
import { graphicController } from '../controllers/graphicController.js'
import { graphicSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Graphics
 *   description: Diseños gráficos
 */

/**
 * @swagger
 * /api/graphics:
 *   get:
 *     summary: Lista de diseños publicados
 *     tags: [Graphics]
 *     responses:
 *       200: { description: Array de diseños }
 */
router.get('/', graphicController.list)

router.get('/search', graphicController.search)
router.get('/seller/:sellerId', graphicController.bySeller)
router.get('/:id', graphicController.detail)

router.post('/', requireAuth, validate(graphicSchemas.create), graphicController.create)
router.put('/:id', requireAuth, validate(graphicSchemas.update), graphicController.update)
router.delete('/:id', requireAuth, graphicController.remove)

export default router
