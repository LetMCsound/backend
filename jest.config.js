/**
 * Configuración de Jest para soportar ES Modules.
 * El script `npm test` arranca Jest con --experimental-vm-modules.
 */
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  // No coleccionar coverage por defecto para que los tests vayan rápido
  collectCoverage: false
}
