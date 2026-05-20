import { Router } from 'express'
import { beatController } from '../controllers/beatController.js'
import { beatSchemas } from '../validators/schemas.js'
import { validate } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Beats
 *   description: Gestión de beats, songs y samples
 */

/**
 * @swagger
 * /api/beats:
 *   get:
 *     summary: Lista beats publicados
 *     tags: [Beats]
 *     parameters:
 *       - { in: query, name: genre,    schema: { type: string } }
 *       - { in: query, name: type,     schema: { type: string, enum: [Beat, Song, Sample, Pack] } }
 *       - { in: query, name: sellerId, schema: { type: string, format: uuid } }
 *       - { in: query, name: limit,    schema: { type: integer, default: 50 } }
 *     responses:
 *       200: { description: Array de beats }
 */
router.get('/', beatController.list)

/**
 * @swagger
 * /api/beats/search:
 *   get:
 *     summary: Búsqueda textual de beats
 *     tags: [Beats]
 *     parameters:
 *       - { in: query, name: q,     required: true, schema: { type: string } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Beats encontrados }
 */
router.get('/search', beatController.search)

/**
 * @swagger
 * /api/beats/popular:
 *   get:
 *     summary: Beats más populares (por likes)
 *     tags: [Beats]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 8 } }
 *     responses:
 *       200: { description: Array de beats populares }
 */
router.get('/popular', beatController.popular)

/**
 * @swagger
 * /api/beats/seller/{sellerId}:
 *   get:
 *     summary: Beats de un vendedor
 *     tags: [Beats]
 *     parameters:
 *       - { in: path, name: sellerId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Array de beats }
 */
router.get('/seller/:sellerId', beatController.bySeller)

/**
 * @swagger
 * /api/beats/{id}:
 *   get:
 *     summary: Detalle de un beat
 *     tags: [Beats]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Beat encontrado }
 *       404: { description: No encontrado }
 */
router.get('/:id', beatController.detail)

/**
 * @swagger
 * /api/beats:
 *   post:
 *     summary: Crea un nuevo beat
 *     tags: [Beats]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:           { type: string }
 *               description:     { type: string }
 *               genre:           { type: string }
 *               type:            { type: string, enum: [Beat, Song, Sample, Pack] }
 *               bpm:             { type: integer }
 *               key:             { type: string }
 *               scale:           { type: string }
 *               cover_url:       { type: string }
 *               audio_preview_url: { type: string }
 *               price_standard:  { type: number }
 *               price_premium:   { type: number }
 *               price_exclusive: { type: number }
 *               tags:            { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Beat creado }
 */
router.post('/', requireAuth, validate(beatSchemas.create), beatController.create)

router.put('/:id', requireAuth, validate(beatSchemas.update), beatController.update)
router.delete('/:id', requireAuth, beatController.remove)

/**
 * @swagger
 * /api/beats/{id}/like:
 *   post:
 *     summary: Incrementa el contador de likes
 *     tags: [Beats]
 *     responses:
 *       200: { description: OK }
 */
router.post('/:id/like', beatController.like)

/**
 * @swagger
 * /api/beats/{id}/play:
 *   post:
 *     summary: Incrementa el contador de plays
 *     tags: [Beats]
 *     responses:
 *       200: { description: OK }
 */
router.post('/:id/play', beatController.play)

export default router
