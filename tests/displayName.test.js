import { jest, describe, test, expect } from '@jest/globals'

// Mock del musicianService antes de importar el helper
jest.unstable_mockModule('../src/services/musicianService.js', () => ({
  musicianService: {
    getByUserId: jest.fn()
  }
}))

const { musicianService } = await import('../src/services/musicianService.js')
const { getDisplayName } = await import('../src/lib/displayName.js')

describe('getDisplayName', () => {
  beforeEach(() => {
    musicianService.getByUserId.mockReset()
  })

  test('devuelve "Usuario" si el user es null', async () => {
    const result = await getDisplayName(null)
    expect(result).toBe('Usuario')
  })

  test('devuelve el nombre del profile de musicians si existe', async () => {
    musicianService.getByUserId.mockResolvedValue({ name: 'KairoWave' })
    const result = await getDisplayName({ id: 'abc', email: 'test@x.com' })
    expect(result).toBe('KairoWave')
  })

  test('cae a user_metadata.name si no hay profile', async () => {
    musicianService.getByUserId.mockResolvedValue(null)
    const result = await getDisplayName({
      id: 'abc',
      email: 'test@x.com',
      user_metadata: { name: 'Mr Beat' }
    })
    expect(result).toBe('Mr Beat')
  })

  test('cae al username del email si no hay metadata', async () => {
    musicianService.getByUserId.mockResolvedValue(null)
    const result = await getDisplayName({
      id: 'abc',
      email: 'juanito@gmail.com'
    })
    expect(result).toBe('juanito')
  })

  test('devuelve "Usuario" si el lookup falla', async () => {
    musicianService.getByUserId.mockRejectedValue(new Error('DB down'))
    const result = await getDisplayName({ id: 'abc' })
    expect(result).toBe('Usuario')
  })

  test('prioriza profile.name sobre user_metadata.name', async () => {
    musicianService.getByUserId.mockResolvedValue({ name: 'Nuevo Nombre' })
    const result = await getDisplayName({
      id: 'abc',
      email: 'test@x.com',
      user_metadata: { name: 'Nombre viejo' }
    })
    expect(result).toBe('Nuevo Nombre')
  })
})
