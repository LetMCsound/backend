import dotenv from 'dotenv'
dotenv.config()

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
for (const v of required) {
  if (!process.env[v]) {
    console.warn(`⚠️  Variable de entorno ${v} no definida. Revisa tu .env`)
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),  // 1 minuto
    max: parseInt(process.env.RATE_LIMIT_MAX || '500', 10)                 // 500 req/min por IP
  }
}
