import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { authSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Usuario registrado }
 *       400: { description: Datos inválidos }
 */
router.post('/register', validate(authSchemas.register), authController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login correcto }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', validate(authSchemas.login), authController.login)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Devuelve el usuario actual
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuario actual }
 *       401: { description: No autenticado }
 */
router.get('/me', requireAuth, authController.me)

export default router
