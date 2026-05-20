import app from './src/app.js'
import { config } from './src/config/env.js'

app.listen(config.port, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║                                                ║
  ║   🎵  LetMCsound Backend                       ║
  ║                                                ║
  ║   Servidor:    http://localhost:${config.port}            ║
  ║   API:         http://localhost:${config.port}/api        ║
  ║   Docs:        http://localhost:${config.port}/api-docs   ║
  ║   Entorno:     ${config.env.padEnd(32)}║
  ║                                                ║
  ╚════════════════════════════════════════════════╝
  `)
})
