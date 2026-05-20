import { Router } from 'express'
import { musicianController } from '../controllers/musicianController.js'

const router = Router()

/**
 * @swagger
 * /api/musicians:
 *   get:
 *     summary: Lista todos los músicos
 *     tags: [Musicians]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array de músicos }
 */
router.get('/', musicianController.list)

/**
 * @swagger
 * /api/musicians/{id}:
 *   get:
 *     summary: Detalle de un músico
 *     tags: [Musicians]
 *     responses:
 *       200: { description: Músico encontrado }
 *       404: { description: No encontrado }
 */
router.get('/:id', musicianController.detail)

export default router
