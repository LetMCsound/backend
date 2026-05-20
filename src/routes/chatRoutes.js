import { Router } from 'express'
import { chatController } from '../controllers/chatController.js'
import { chatSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Conversaciones y mensajes (CRUD; realtime via Supabase)
 */

// ─── Conversations ───

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Mis conversaciones
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array de conversaciones }
 */
router.get('/conversations', requireAuth, chatController.myConversations)

/**
 * @swagger
 * /api/chat/conversations:
 *   post:
 *     summary: Obtiene o crea una conversación con un vendedor
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Conversación encontrada o creada }
 */
router.post('/conversations', requireAuth, validate(chatSchemas.getOrCreate), chatController.getOrCreate)

router.patch('/conversations/:id/status', requireAuth, validate(chatSchemas.updateStatus), chatController.updateStatus)
router.patch('/conversations/:id/sign', requireAuth, validate(chatSchemas.signContract), chatController.signContract)

// ─── Messages ───

/**
 * @swagger
 * /api/chat/conversations/{id}/messages:
 *   get:
 *     summary: Mensajes de una conversación
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array de mensajes }
 */
router.get('/conversations/:id/messages', requireAuth, chatController.getMessages)

/**
 * @swagger
 * /api/chat/conversations/{id}/messages:
 *   post:
 *     summary: Envía un mensaje
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Mensaje creado }
 */
router.post('/conversations/:id/messages', requireAuth, validate(chatSchemas.sendMessage), chatController.sendMessage)

router.patch('/messages/:messageId/offer', requireAuth, validate(chatSchemas.respondOffer), chatController.respondToOffer)

export default router
