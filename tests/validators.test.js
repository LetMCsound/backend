import { jest } from '@jest/globals'
import {
  authSchemas,
  beatSchemas,
  lyricsSchemas,
  musicianSchemas,
  filmSchemas,
  graphicSchemas,
  commentSchemas,
  favoriteSchemas
} from '../src/validators/schemas.js'

describe('Validadores Joi', () => {
  // ───────────────────────────────────────────────────────
  describe('authSchemas.register', () => {
    test('acepta un email y contraseña válidos', () => {
      const { error } = authSchemas.register.validate({
        email: 'test@example.com',
        password: 'Password1!'
      })
      expect(error).toBeUndefined()
    })

    test('rechaza email inválido', () => {
      const { error } = authSchemas.register.validate({
        email: 'no-es-email',
        password: 'Password1!'
      })
      expect(error).toBeDefined()
    })

    test('rechaza contraseña corta', () => {
      const { error } = authSchemas.register.validate({
        email: 'a@b.com',
        password: 'Ab1!'
      })
      expect(error).toBeDefined()
      expect(error.details[0].message).toMatch(/8 caracteres/i)
    })

    test('rechaza contraseña sin mayúscula', () => {
      const { error } = authSchemas.register.validate({
        email: 'a@b.com',
        password: 'password1!'
      })
      expect(error).toBeDefined()
    })

    test('rechaza contraseña sin número', () => {
      const { error } = authSchemas.register.validate({
        email: 'a@b.com',
        password: 'Password!'
      })
      expect(error).toBeDefined()
    })

    test('rechaza contraseña sin símbolo', () => {
      const { error } = authSchemas.register.validate({
        email: 'a@b.com',
        password: 'Password1'
      })
      expect(error).toBeDefined()
    })
  })

  // ───────────────────────────────────────────────────────
  describe('authSchemas.login', () => {
    test('acepta email y password no vacíos', () => {
      const { error } = authSchemas.login.validate({
        email: 'a@b.com',
        password: 'cualquier-cosa'
      })
      expect(error).toBeUndefined()
    })

    test('rechaza email faltante', () => {
      const { error } = authSchemas.login.validate({ password: 'abc' })
      expect(error).toBeDefined()
    })
  })

  // ───────────────────────────────────────────────────────
  describe('beatSchemas.create', () => {
    test('acepta beat mínimo válido (solo title)', () => {
      const { error, value } = beatSchemas.create.validate({ title: 'Mi beat' })
      expect(error).toBeUndefined()
      expect(value.title).toBe('Mi beat')
      expect(value.type).toBe('Beat') // default
      expect(value.is_published).toBe(true) // default
    })

    test('aplica defaults de precios', () => {
      const { value } = beatSchemas.create.validate({ title: 'X' })
      expect(value.price_standard).toBe(29.99)
      expect(value.price_premium).toBe(79.99)
      expect(value.price_exclusive).toBe(199.99)
    })

    test('rechaza title vacío', () => {
      const { error } = beatSchemas.create.validate({ title: '' })
      expect(error).toBeDefined()
    })

    test('rechaza type inválido', () => {
      const { error } = beatSchemas.create.validate({
        title: 'X',
        type: 'NotABeatType'
      })
      expect(error).toBeDefined()
    })

    test('rechaza BPM fuera de rango', () => {
      const { error } = beatSchemas.create.validate({ title: 'X', bpm: 999 })
      expect(error).toBeDefined()
    })

    test('acepta tags como array de strings', () => {
      const { error, value } = beatSchemas.create.validate({
        title: 'X',
        tags: ['trap', 'dark', '808']
      })
      expect(error).toBeUndefined()
      expect(value.tags).toEqual(['trap', 'dark', '808'])
    })
  })

  // ───────────────────────────────────────────────────────
  describe('beatSchemas.update', () => {
    test('requiere al menos un campo', () => {
      const { error } = beatSchemas.update.validate({})
      expect(error).toBeDefined()
    })

    test('permite actualizar solo el título', () => {
      const { error } = beatSchemas.update.validate({ title: 'Nuevo título' })
      expect(error).toBeUndefined()
    })
  })

  // ───────────────────────────────────────────────────────
  describe('lyricsSchemas.create', () => {
    test('requiere title y content', () => {
      const { error: e1 } = lyricsSchemas.create.validate({ content: 'X' })
      expect(e1).toBeDefined()
      const { error: e2 } = lyricsSchemas.create.validate({ title: 'X' })
      expect(e2).toBeDefined()
    })

    test('acepta letra completa válida', () => {
      const { error, value } = lyricsSchemas.create.validate({
        title: 'My song',
        content: 'Letra completa de la canción...'
      })
      expect(error).toBeUndefined()
      expect(value.language).toBe('es') // default
    })
  })

  // ───────────────────────────────────────────────────────
  describe('musicianSchemas.update', () => {
    test('acepta slug válido (kebab-case)', () => {
      const { error } = musicianSchemas.update.validate({ slug: 'mi-artista-cool' })
      expect(error).toBeUndefined()
    })

    test('rechaza slug con espacios o mayúsculas', () => {
      const { error } = musicianSchemas.update.validate({ slug: 'Mi Slug' })
      expect(error).toBeDefined()
    })

    test('permite enlaces sociales como handles (no URL)', () => {
      const { error } = musicianSchemas.update.validate({
        link_instagram: '@miusuario',
        link_youtube: 'mi-canal'
      })
      expect(error).toBeUndefined()
    })

    test('permite limpiar campos pasando null', () => {
      const { error } = musicianSchemas.update.validate({
        bio: null,
        location: null
      })
      expect(error).toBeUndefined()
    })
  })

  // ───────────────────────────────────────────────────────
  describe('filmSchemas.create', () => {
    test('film usa price único (no price_standard)', () => {
      const { error } = filmSchemas.create.validate({
        title: 'My film',
        price: 99.99
      })
      expect(error).toBeUndefined()
    })

    test('film tiene campo duration', () => {
      const { error, value } = filmSchemas.create.validate({
        title: 'X',
        duration: '3:45'
      })
      expect(error).toBeUndefined()
      expect(value.duration).toBe('3:45')
    })
  })

  // ───────────────────────────────────────────────────────
  describe('graphicSchemas.create', () => {
    test('graphic usa style en vez de genre', () => {
      const { error, value } = graphicSchemas.create.validate({
        title: 'X',
        style: 'Dark / Minimal'
      })
      expect(error).toBeUndefined()
      expect(value.style).toBe('Dark / Minimal')
    })
  })

  // ───────────────────────────────────────────────────────
  describe('commentSchemas.create', () => {
    test('requiere contentId, contentType y text', () => {
      const { error: e1 } = commentSchemas.create.validate({
        contentType: 'beat',
        text: 'Buen beat'
      })
      expect(e1).toBeDefined()
    })

    test('rechaza contentType inválido', () => {
      const { error } = commentSchemas.create.validate({
        contentId: 'abc-123',
        contentType: 'unknown',
        text: 'X'
      })
      expect(error).toBeDefined()
    })

    test('rechaza texto vacío', () => {
      const { error } = commentSchemas.create.validate({
        contentId: 'abc',
        contentType: 'beat',
        text: ''
      })
      expect(error).toBeDefined()
    })
  })

  // ───────────────────────────────────────────────────────
  describe('favoriteSchemas.add', () => {
    test('acepta tipo válido', () => {
      const { error } = favoriteSchemas.add.validate({
        contentId: 'abc',
        contentType: 'lyric'
      })
      expect(error).toBeUndefined()
    })

    test('rechaza tipo desconocido', () => {
      const { error } = favoriteSchemas.add.validate({
        contentId: 'abc',
        contentType: 'song' // no está en el enum
      })
      expect(error).toBeDefined()
    })
  })
})
