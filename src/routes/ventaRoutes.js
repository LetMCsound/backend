import { Router } from 'express'
import { ventaController } from '../controllers/ventaController.js'
import { ventaSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registra una compra
 *     tags: [Ventas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Venta registrada }
 */
router.post('/', requireAuth, validate(ventaSchemas.create), ventaController.create)

/**
 * @swagger
 * /api/ventas/me:
 *   get:
 *     summary: Ventas del usuario autenticado
 *     tags: [Ventas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array de ventas }
 */
router.get('/me', requireAuth, ventaController.myVentas)

export default router
