# Arquitectura del Proyecto

Este documento describe las prácticas y patrones de desarrollo utilizados.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE                           │
│              (Astro + Preact)                        │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────▼───────────────────────────────┐
│                 API GATEWAY                          │
│                (NestJS :3000)                        │
├─────────────────────────────────────────────────────┤
│  Middleware: Helmet, CORS, Rate Limiting, Logger    │
└───────┬─────────────────┬─────────────────┬─────────┘
        │                 │                 │
   ┌────▼────┐      ┌─────▼─────┐    ┌─────▼─────┐
   │  Auth   │      │   Users   │    │  Uploads  │
   │ Module  │      │  Module   │    │  Module   │
   └────┬────┘      └─────┬─────┘    └─────┬─────┘
        │                 │                 │
┌───────▼─────────────────▼─────────────────▼─────────┐
│                   PROVIDERS                          │
├──────────────┬──────────────┬───────────────────────┤
│  PostgreSQL  │  Dragonfly   │      RustFS/MinIO     │
│  (Drizzle)   │   (Cache)    │      (Storage)        │
└──────────────┴──────────────┴───────────────────────┘
```

## 📁 Estructura de Carpetas

```
src/
├── infrastructure/          # Núcleo técnico
│   ├── config/              # Configuración y environments
│   ├── providers/           # DB, Cache, Mail, Storage
│   ├── filters/             # Exception handlers
│   ├── guards/              # Auth guards
│   ├── middlewares/         # HTTP middlewares
│   └── pipes/               # Validation pipes
│
├── modules/                 # Features del negocio
│   ├── auth/                # Autenticación
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── strategies/      # Passport strategies
│   │   ├── dto/
│   │   └── __tests__/
│   │
│   ├── users/               # Gestión de usuarios
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── cache/
│   │   └── __tests__/
│   │
│   └── health/              # Health checks
│
├── components/              # Componentes Preact
├── pages/                   # Páginas Astro
└── hooks/                   # Hooks del cliente
```

## 🔐 Autenticación

### Estrategias Soportadas

| Estrategia   | Uso                | Guard                 |
| ------------ | ------------------ | --------------------- |
| Local        | Email + contraseña | `LocalAuthGuard`      |
| JWT          | API stateless      | `JwtAuthGuard`        |
| Google OAuth | Login social       | `AuthGuard('google')` |
| Session      | Web tradicional    | `AuthenticatedGuard`  |

### Flujo de Autenticación

```
1. Usuario envía credenciales → POST /auth/login
2. LocalStrategy valida → bcrypt.compare()
3. Passport serializa usuario → Session/JWT
4. Requests siguientes → Guard verifica token/session
```

## ✅ Validación

Usamos **Zod** para validación con i18n:

```typescript
// Schema
const userSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

// Controller
@UsePipes(new ZodPipe(userSchema))
@Post('/')
create(@Body() dto: UserDto) {}
```

## 📊 Base de Datos

### Drizzle ORM

```typescript
// Schema (entities)
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique(),
    password: varchar("password", { length: 255 }),
});

// Query
const user = await db.query.users.findFirst({
    where: eq(users.email, email),
});
```

### Migraciones

```bash
pnpm run db:generate   # Generar migración
pnpm run db:migrate    # Aplicar migraciones
pnpm run db:push       # Push directo (dev)
pnpm run db:studio     # GUI visual
```

## 🚀 Cache con Dragonfly

Sistema de cache de dos niveles:

```typescript
// Service level
@Injectable()
class UserCacheService {
    private readonly TTL = 300; // 5 min

    async show(id: number) {
        const cacheKey = `user:${id}`;

        // 1. Check cache
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        // 2. Query DB
        const user = await this.repo.findById(id);

        // 3. Store in cache
        await this.cache.set(cacheKey, user, this.TTL);

        return user;
    }
}
```

## 🧪 Testing

### Estructura

```
__tests__/
├── *.test.ts          # Unit tests
└── *.e2e.test.ts      # E2E tests
```

### Comandos

```bash
pnpm test              # Ejecutar todos
pnpm run test:watch    # Watch mode
pnpm run test:cov      # Coverage
```

### Ejemplo Test

```typescript
describe("AuthService", () => {
    it("should hash password on register", async () => {
        const hashSpy = vi.spyOn(bcrypt, "hash");

        await service.register(dto);

        expect(hashSpy).toHaveBeenCalledWith(dto.password, 10);
    });
});
```

## 🔧 Git Hooks

### Pre-commit (Husky + lint-staged)

```bash
# Antes de cada commit:
1. lint-staged → biome check/format
2. commitlint → valida mensaje
```

### Conventional Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
refactor: refactorización
test: agregar tests
chore: mantenimiento
```

## 📈 Health Checks

Endpoints para monitoreo:

| Endpoint               | Uso                  |
| ---------------------- | -------------------- |
| `GET /health`          | Check básico         |
| `GET /health/ready`    | Kubernetes readiness |
| `GET /health/live`     | Kubernetes liveness  |
| `GET /health/detailed` | Métricas de memoria  |

## 🔒 Seguridad

| Medida        | Implementación                |
| ------------- | ----------------------------- |
| Headers       | Helmet                        |
| CORS          | Configurable via ENV          |
| Rate Limiting | ThrottlerModule (100 req/min) |
| Validación    | Zod schemas                   |
| Passwords     | bcrypt (10 rounds)            |
| Secrets       | .env + validación Zod         |

## 📚 API Reference

Documentación interactiva disponible en `/reference` (Swagger + Scalar).
