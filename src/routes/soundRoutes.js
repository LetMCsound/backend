import { Router } from 'express'
import { soundController } from '../controllers/soundController.js'
import { soundSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/sounds:
 *   get:
 *     summary: Lista todos los sounds (con filtros opcionales)
 *     tags: [Sounds]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *       - in: query
 *         name: section
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Array de sounds }
 */
router.get('/', soundController.list)

/**
 * @swagger
 * /api/sounds/trending:
 *   get:
 *     summary: Sounds más populares por likes
 *     tags: [Sounds]
 *     responses:
 *       200: { description: Array de sounds }
 */
router.get('/trending', soundController.trending)

/**
 * @swagger
 * /api/sounds/recent:
 *   get:
 *     summary: Sounds más recientes
 *     tags: [Sounds]
 *     responses:
 *       200: { description: Array de sounds }
 */
router.get('/recent', soundController.recent)

/**
 * @swagger
 * /api/sounds/{id}:
 *   get:
 *     summary: Detalle de un sound
 *     tags: [Sounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Sound encontrado }
 *       404: { description: No encontrado }
 */
router.get('/:id', soundController.detail)

/**
 * @swagger
 * /api/sounds:
 *   post:
 *     summary: Crea un nuevo sound
 *     tags: [Sounds]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Sound creado }
 */
router.post('/', requireAuth, validate(soundSchemas.create), soundController.create)

router.put('/:id', requireAuth, validate(soundSchemas.update), soundController.update)
router.delete('/:id', requireAuth, soundController.remove)

export default router
