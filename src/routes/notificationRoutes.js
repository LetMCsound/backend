import { Router } from 'express'
import { notificationController } from '../controllers/notificationController.js'
import { notificationSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notificaciones de usuario
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Mis notificaciones
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 30 } }
 *     responses:
 *       200: { description: Array de notificaciones }
 */
router.get('/', requireAuth, notificationController.myNotifications)

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Marca una notificación como leída
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Marcada }
 */
router.patch('/:id/read', requireAuth, notificationController.markAsRead)

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Marca todas como leídas
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: OK }
 */
router.patch('/read-all', requireAuth, notificationController.markAllAsRead)

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Crea una notificación (admin / sistema)
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Notificación creada }
 */
router.post('/', requireAuth, validate(notificationSchemas.create), notificationController.create)

export default router
