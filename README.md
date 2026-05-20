# LetMCsound — Backend API

Backend REST API para la plataforma de música **LetMCsound**.
Proyecto Intermodular de Grado Superior.

## Stack tecnológico

- **Node.js** + **Express** — servidor HTTP y routing
- **Supabase** — base de datos PostgreSQL, autenticación y storage
- **Joi** — validación de datos
- **JWT (Supabase Auth)** — autenticación
- **Swagger / OpenAPI** — documentación interactiva de la API
- **Helmet, CORS, Rate Limiting** — seguridad
- **Morgan** — logging
- **pdf-lib** — generación de contratos PDF

## Arquitectura

Patrón **Controller → Service → Database**:

```
src/
├── config/         Configuración (env vars)
├── controllers/    Lógica de los endpoints (HTTP)
├── docs/           Configuración Swagger
├── lib/            Cliente Supabase
├── middlewares/    Auth, validación, errores
├── routes/         Definición de rutas REST
├── services/       Lógica de negocio (habla con BD)
└── validators/     Schemas Joi
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
#    Edita .env con tus credenciales reales

# 3. Arrancar en desarrollo (con auto-reload)
npm run dev

# 4. O en producción
npm start
```

Servidor en `http://localhost:3000`.
Documentación interactiva en `http://localhost:3000/api-docs`.

## Endpoints principales

### Auth
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registro de usuario | ❌ |
| POST | `/api/auth/login` | Login (devuelve JWT) | ❌ |
| GET  | `/api/auth/me` | Usuario actual | ✅ |

### Beats
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET    | `/api/beats` | Lista (filtros: genre, type, sellerId, limit) | ❌ |
| GET    | `/api/beats/search?q=` | Búsqueda textual | ❌ |
| GET    | `/api/beats/popular` | Top por likes | ❌ |
| GET    | `/api/beats/seller/:sellerId` | Beats de un vendedor | ❌ |
| GET    | `/api/beats/:id` | Detalle | ❌ |
| POST   | `/api/beats` | Crear | ✅ |
| PUT    | `/api/beats/:id` | Actualizar (solo propietario) | ✅ |
| DELETE | `/api/beats/:id` | Eliminar (solo propietario) | ✅ |
| POST   | `/api/beats/:id/like` | +1 like | ❌ |
| POST   | `/api/beats/:id/play` | +1 play | ❌ |

### Lyrics
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET    | `/api/lyrics` | Lista (filtros: genre, language) | ❌ |
| GET    | `/api/lyrics/search?q=` | Búsqueda textual | ❌ |
| GET    | `/api/lyrics/seller/:sellerId` | Letras de un vendedor | ❌ |
| GET    | `/api/lyrics/:id` | Detalle | ❌ |
| POST   | `/api/lyrics` | Crear | ✅ |
| PUT    | `/api/lyrics/:id` | Actualizar | ✅ |
| DELETE | `/api/lyrics/:id` | Eliminar | ✅ |

### Musicians
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/musicians` | Lista (filtros: category, location) | ❌ |
| GET | `/api/musicians/search?q=` | Búsqueda textual | ❌ |
| GET | `/api/musicians/me` | Mi perfil | ✅ |
| GET | `/api/musicians/slug/:slug` | Por slug público | ❌ |
| GET | `/api/musicians/:id` | Detalle por ID | ❌ |
| PUT | `/api/musicians/:id` | Actualizar perfil | ✅ |

### Ventas
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/ventas` | Registrar compra | ✅ |
| GET  | `/api/ventas/me` | Mis compras | ✅ |

### Contratos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/contratos/generar` | Genera y descarga PDF de contrato | ✅ |

## Esquema de BD (Supabase)

El esquema completo está en las migraciones del frontend:
`letmcsound/frontend/supabase/migrations/`

Tablas principales:
- **beats** — Beats, songs y samples con precios por licencia, tags y stats
- **lyrics** — Letras de canciones con idioma y contenido
- **musicians** — Perfiles de artistas con slug, categorías y redes sociales
- **ventas** — Registro de compras
- **usuarios** — Datos extendidos de perfil (Supabase Auth maneja credenciales)

Todas las tablas tienen **Row Level Security (RLS)** activo.

## Autenticación

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <jwt_token>
```

El token se obtiene en `POST /api/auth/login`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default: 3000) |
| `NODE_ENV` | `development` o `production` |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Anon key pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (solo para tareas admin) |
| `CORS_ORIGIN` | Origen permitido del frontend |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limit (ms) |
| `RATE_LIMIT_MAX` | Peticiones máx por ventana |

## Tests

```bash
npm test
```

## Autor

Martín — Proyecto Intermodular Grado Superior.
