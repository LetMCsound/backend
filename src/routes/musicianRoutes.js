import { Router } from 'express'
import { musicianController } from '../controllers/musicianController.js'
import { musicianSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Musicians
 *   description: Perfiles de músicos y artistas
 */

/**
 * @swagger
 * /api/musicians:
 *   get:
 *     summary: Lista de músicos publicados
 *     tags: [Musicians]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string, example: beatmaker } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: limit,    schema: { type: integer, default: 50 } }
 *     responses:
 *       200: { description: Array de músicos }
 */
router.get('/', musicianController.list)

/**
 * @swagger
 * /api/musicians/search:
 *   get:
 *     summary: Búsqueda textual de músicos
 *     tags: [Musicians]
 *     parameters:
 *       - { in: query, name: q, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Músicos encontrados }
 */
router.get('/search', musicianController.search)

/**
 * @swagger
 * /api/musicians/me:
 *   get:
 *     summary: Mi perfil de músico
 *     tags: [Musicians]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil del usuario autenticado }
 */
router.get('/me', requireAuth, musicianController.myProfile)

/**
 * @swagger
 * /api/musicians/slug/{slug}:
 *   get:
 *     summary: Perfil público por slug
 *     tags: [Musicians]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Músico encontrado }
 *       404: { description: No encontrado }
 */
router.get('/slug/:slug', musicianController.bySlug)

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

router.put('/:id', requireAuth, validate(musicianSchemas.update), musicianController.update)

export default router
