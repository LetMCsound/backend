import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import app from '../src/app.js'

describe('LetMCsound REST API — Endpoints públicos', () => {
  // ─── Health & root ────────────────────────────────────
  describe('GET /api/health', () => {
    test('responde 200 con status ok', async () => {
      const res = await request(app).get('/api/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ok')
      expect(res.body.timestamp).toBeDefined()
      expect(res.body.version).toBeDefined()
    })
  })

  describe('GET /', () => {
    test('devuelve info de la API', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('LetMCsound API')
      expect(res.body.docs).toBe('/api-docs')
    })
  })

  describe('GET /api/health (varios)', () => {
    test('responde rápido (< 1s)', async () => {
      const t0 = Date.now()
      await request(app).get('/api/health')
      expect(Date.now() - t0).toBeLessThan(1000)
    })
  })

  describe('GET /api/ruta-inexistente', () => {
    test('devuelve 404 con mensaje claro', async () => {
      const res = await request(app).get('/api/no-existe')
      expect(res.status).toBe(404)
      expect(res.body.error).toMatch(/no encontrada/i)
    })
  })

  // ─── Endpoints autenticados (sin token) ───────────────
  describe('Rutas protegidas sin token → 401', () => {
    const protectedRoutes = [
      ['get', '/api/auth/me'],
      ['get', '/api/musicians/me'],
      ['post', '/api/beats'],
      ['put', '/api/beats/abc'],
      ['delete', '/api/beats/abc'],
      ['post', '/api/lyrics'],
      ['post', '/api/films'],
      ['post', '/api/graphics'],
      ['get', '/api/favorites'],
      ['post', '/api/favorites'],
      ['get', '/api/notifications'],
      ['post', '/api/comments'],
      ['get', '/api/chat/conversations'],
      ['post', '/api/chat/conversations'],
      ['post', '/api/contratos/generar']
    ]

    test.each(protectedRoutes)('%s %s → 401', async (method, path) => {
      const res = await request(app)[method](path).send({})
      expect(res.status).toBe(401)
      expect(res.body.error).toBeDefined()
    })
  })

  // ─── Validación en endpoints públicos ─────────────────
  describe('POST /api/auth/login con datos vacíos → 400', () => {
    test('rechaza body vacío', async () => {
      const res = await request(app).post('/api/auth/login').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/inválidos/i)
    })

    test('rechaza email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'no-es-email', password: 'x' })
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/register con contraseña débil → 400', () => {
    test('rechaza password sin mayúsculas/números/símbolos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'a@b.com', password: 'simple' })
      expect(res.status).toBe(400)
      expect(res.body.details).toBeDefined()
      expect(Array.isArray(res.body.details)).toBe(true)
    })
  })

  // ─── Endpoints de lectura públicos ────────────────────
  // NOTA: estos hacen una llamada real a Supabase
  describe('GET /api/beats — datos reales', () => {
    test('devuelve un array', async () => {
      const res = await request(app).get('/api/beats?limit=2')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    }, 15000) // timeout 15s por la red
  })

  describe('GET /api/musicians', () => {
    test('devuelve un array de músicos', async () => {
      const res = await request(app).get('/api/musicians?limit=2')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    }, 15000)
  })

  describe('GET /api/comments sin params → 400', () => {
    test('exige contentId y contentType', async () => {
      const res = await request(app).get('/api/comments')
      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/contentId|contentType/i)
    })
  })

  // ─── Swagger ──────────────────────────────────────────
  describe('GET /api-docs.json', () => {
    test('devuelve el spec OpenAPI', async () => {
      const res = await request(app).get('/api-docs.json')
      expect(res.status).toBe(200)
      expect(res.body.openapi).toBe('3.0.0')
      expect(res.body.info.title).toBe('LetMCsound API')
    })
  })
})
