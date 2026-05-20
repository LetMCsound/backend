import { Router } from 'express'
import { contratoController } from '../controllers/contratoController.js'
import { contratoSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/contratos/generar:
 *   post:
 *     summary: Genera y descarga un contrato PDF de licencia
 *     tags: [Contratos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, precio, licencia]
 *             properties:
 *               titulo: { type: string }
 *               precio: { type: number }
 *               licencia: { type: string, enum: [Standard, Premium, Exclusiva] }
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 */
router.post('/generar', requireAuth, validate(contratoSchemas.generar), contratoController.generar)

export default router
