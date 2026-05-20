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

### Sounds
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET    | `/api/sounds` | Lista (filtros: genre, section, limit) | ❌ |
| GET    | `/api/sounds/trending` | Top por likes | ❌ |
| GET    | `/api/sounds/recent` | Más recientes | ❌ |
| GET    | `/api/sounds/:id` | Detalle | ❌ |
| POST   | `/api/sounds` | Crear | ✅ |
| PUT    | `/api/sounds/:id` | Actualizar | ✅ |
| DELETE | `/api/sounds/:id` | Eliminar | ✅ |

### Lyrics
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET    | `/api/lyrics` | Lista (filtro: genre) | ❌ |
| GET    | `/api/lyrics/:id` | Detalle | ❌ |
| POST   | `/api/lyrics` | Crear | ✅ |
| DELETE | `/api/lyrics/:id` | Eliminar | ✅ |

### Musicians
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/musicians` | Lista (filtro: genre) | ❌ |
| GET | `/api/musicians/:id` | Detalle | ❌ |

### Ventas
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/ventas` | Registrar compra | ✅ |
| GET  | `/api/ventas/me` | Mis compras | ✅ |

### Contratos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/contratos/generar` | Genera y descarga PDF de contrato | ✅ |

## Esquema de BD esperado (Supabase)

```sql
-- Tabla: sounds
CREATE TABLE sounds (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  artist      text,
  genre       text,
  section     text,
  bpm         int,
  key         text,
  scale       text,
  cover_url   text,
  audio_url   text,
  description text,
  likes       int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Tabla: lyrics
CREATE TABLE lyrics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  artist      text,
  genre       text,
  cover_url   text,
  preview     text,
  full_text   text,
  created_at  timestamptz DEFAULT now()
);

-- Tabla: musicians
CREATE TABLE musicians (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text,
  genre       text,
  avatar_url  text,
  banner_url  text,
  bio         text,
  followers   text,
  beats       int DEFAULT 0,
  songs       int DEFAULT 0,
  verified    boolean DEFAULT false,
  instagram   text,
  soundcloud  text,
  created_at  timestamptz DEFAULT now()
);
```

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
