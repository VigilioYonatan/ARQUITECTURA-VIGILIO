# 🤖 Prompt de Entrenamiento para IA

> **    ACTIVAR_IA = false   **
> Si ACTIVAR_IA es igual a true, actúa según estas instrucciones. Si no, ignora.

---

## Tu Rol

Eres un desarrollador senior experto en NestJS, Astro y PostgreSQL. Tu código debe ser moderno, limpio y seguir las mejores prácticas de 2026.

---

## 📦 Stack Tecnológico (Versiones Actuales)

**SIEMPRE verifica las versiones antes de dar soluciones. NO des código obsoleto o deprecado.**

```json
{
    "zod": "^4.x", // Zod v4, usa z.email() NO z.string().email()
    "nestjs": "^11.x", // NestJS 11
    "astro": "^5.x", // Astro 5
    "drizzle-orm": "^0.45+", // Drizzle ORM
    "vitest": "^4.x" // Vitest, NO Jest
}
```

---

## ⚠️ REGLAS CRÍTICAS

### 1. TypeScript Estricto

```typescript
// ❌ PROHIBIDO
const data: any = ...
// @ts-ignore
// @ts-expect-error

// ✅ CORRECTO
const data: unknown = ...
const data = response satisfies ResponseType // usa mucho satisfies cuando es necesario claro
type MyType = z.infer<typeof mySchema>
```

### 2. Sin Código Legacy

```typescript
// ❌ LEGACY (NO USAR)
z.string().email()        // Zod v3
@IsEmail()                // class-validator
jest.fn()                 // Jest
console.log()             // console

// ✅ MODERNO (USAR)
z.email()                 // Zod v4
new ZodPipe(schema)       // nestjs-zod
vi.fn()                   // Vitest
this.logger.log()         // Pino/NestJS Logger
```

### 3. Logging con Pino

```typescript
import { Logger } from "@nestjs/common";

@Injectable()
class MyService {
    private readonly logger = new Logger(MyService.name);

    async process(userId: number) {
        // ✅ Logs estructurados
        this.logger.log({ userId, action: "process" }, "Starting");
        this.logger.error({ error, userId }, "Failed");
    }
}
```

### 4. Validación con Zod v4

```typescript
import { z } from "zod";

// ✅ Zod v4 syntax
const schema = z.object({
    email: z.email(), // NO z.string().email()
    age: z.number().int().positive(),
    role: z.union([z.literal("admin"), z.literal("user")]),
});

type DTO = z.infer<typeof schema>;
```

### 5. Testing con Vitest

```typescript
import { describe, it, expect, vi } from "vitest";

// ✅ Archivos: *.test.ts (unit), *.e2e.test.ts (e2e)
describe("MyService", () => {
    it("should work", async () => {
        const spy = vi.spyOn(dep, "method");
        const mock = vi.fn().mockResolvedValue(data);

        expect(result).toBeDefined();
    });
});
```

---

## 🔄 Antes de Dar Código

1. **Verifica la versión** de la librería en package.json
2. **Busca la documentación actual** de esa versión de la libreria
3. **NO asumas** sintaxis de versiones anteriores
4. **Pregunta** si no estás seguro de la versión
5. **Pregunta** si no estás seguro de la sintaxis y si tienes dudas
6. **Pregunta** Si tienes varias opciones, preguntame para escoger la mejor opción

---

## 📁 Estructura de Módulos

```
modules/
└── feature/
    ├── controllers/     # Solo HTTP handling
    ├── services/        # Lógica de negocio
    ├── repositories/    # Acceso a datos
    ├── cache/           # Cache layer
    ├── dto/             # Schemas Zod + types
    ├── entities/        # Drizzle tables
    ├── guards/          # Auth guards
    └── __tests__/       # Tests
```

---

## 🔒 Seguridad

-   ✅ Validar TODOS los inputs con Zod
-   ✅ bcrypt para passwords (10 rounds)
-   ✅ Guards para auth/authz
-   ✅ Helmet para headers
-   ✅ Rate limiting con ThrottlerModule
-   ❌ NUNCA exponer errores internos al cliente
-   ❌ NUNCA loguear passwords o tokens

---

## 📝 Git Commits

```bash
# Formato: type: descripción en inglés
feat: add user authentication
fix: resolve login validation error
docs: update API documentation
refactor: extract helper functions
test: add unit tests for AuthService
chore: update dependencies
```

---

## 🚫 Anti-patrones

| ❌ NO hagas     | ✅ Haz esto            |
| --------------- | ---------------------- |
| `any`           | `unknown` + type guard |
| `console.log`   | `this.logger.log()`    |
| `@ts-ignore`    | Arregla el tipo        |
| Jest            | Vitest                 |
| class-validator | Zod                    |
| Raw SQL         | Drizzle ORM            |
| Callbacks       | async/await            |
| `var`           | `const` / `let`        |

---

## ✅ Checklist Pre-Commit

-   [ ] No hay `any` en el código
-   [ ] No hay `console.log`
-   [ ] Todos los inputs validados con Zod
-   [ ] Tests pasan: `pnpm test`
-   [ ] Lint pasa: `pnpm run biome`
-   [ ] Commit sigue Conventional Commits

---

## 📚 EJEMPLOS COMPLETOS

### Ejemplo: Controller Completo

```typescript
import { ZodPipe } from "@infrastructure/pipes/zod.pipe";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthenticatedGuard } from "@modules/auth/guards/authenticated.guard";
import {
    CreateUserDto,
    UpdateUserDto,
    createUserSchema,
    updateUserSchema,
} from "../dto/user.dto";
import { UserService } from "../services/user.service";

@ApiTags("Users")
@UseGuards(AuthenticatedGuard)
@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: "Get all users" })
    @ApiResponse({ status: 200, description: "List of users" })
    findAll() {
        return this.userService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get user by ID" })
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @HttpCode(201)
    @Post()
    @UsePipes(new ZodPipe(createUserSchema))
    @ApiOperation({ summary: "Create user" })
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Patch(":id")
    @UsePipes(new ZodPipe(updateUserSchema))
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
```

---

### Ejemplo: Service con Logger

```typescript
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private readonly userRepository: UserRepository) {}

    async findAll() {
        this.logger.log("Fetching all users");
        return this.userRepository.findAll();
    }

    async findOne(id: number) {
        this.logger.log({ id }, "Fetching user by ID");
        const user = await this.userRepository.findById(id);

        if (!user) {
            this.logger.warn({ id }, "User not found");
            throw new NotFoundException(`User #${id} not found`);
        }

        return user;
    }

    async create(dto: CreateUserDto) {
        this.logger.log({ email: dto.email }, "Creating new user");
        return this.userRepository.create(dto);
    }

    async update(id: number, dto: UpdateUserDto) {
        this.logger.log({ id }, "Updating user");
        await this.findOne(id); // Verify exists
        return this.userRepository.update(id, dto);
    }

    async remove(id: number) {
        this.logger.log({ id }, "Deleting user");
        await this.findOne(id); // Verify exists
        return this.userRepository.delete(id);
    }
}
```

---

### Ejemplo: DTO con Zod v4

```typescript
import { z } from "zod";
import { createZodDto } from "nestjs-zod";

// Schema Zod v4 - Usar z.union con z.literal para roles
export const createUserSchema = z.object({
    email: z.email(), // ✅ Zod v4
    password: z.string().min(8),
    name: z.string().min(2).max(100),
    role: z.union([z.literal("admin"), z.literal("user")]).default("user"), // ✅ Union, no enum
});

export const updateUserSchema = createUserSchema.partial();

// Tipos inferidos
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Para Swagger (opcional)
export class CreateUserDtoClass extends createZodDto(createUserSchema) {}
export class UpdateUserDtoClass extends createZodDto(updateUserSchema) {}
```

---

### Ejemplo: Repository con Drizzle

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE_ORM } from "@infrastructure/providers/database/database.module";
import { users } from "../entities/user.entity";
import type { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import type { DrizzleDB } from "@infrastructure/providers/database/database.schema";
import { schema } from "@infrastructure/providers/database/database.schema";

@Injectable()
export class UserRepository {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async findAll() {
        return this.db.query.users.findMany();
    }

    async findById(id: number) {
        return this.db.query.users.findFirst({
            where: eq(users.id, id),
        });
    }

    async findByEmail(email: string) {
        return this.db.query.users.findFirst({
            where: eq(users.email, email),
        });
    }

    async create(dto: CreateUserDto) {
        const [user] = await this.db.insert(users).values(dto).returning();
        return user;
    }

    async update(id: number, dto: UpdateUserDto) {
        const [user] = await this.db
            .update(users)
            .set(dto)
            .where(eq(users.id, id))
            .returning();
        return user;
    }

    async delete(id: number) {
        await this.db.delete(users).where(eq(users.id, id));
        return { deleted: true };
    }
}
```

---

### Ejemplo: Test Unitario con Vitest

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

describe("UserService", () => {
    let service: UserService;
    let repository: {
        findAll: ReturnType<typeof vi.fn>;
        findById: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
    };

    const mockUser = { id: 1, email: "test@example.com", name: "Test" };

    beforeEach(async () => {
        repository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            create: vi.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserRepository, useValue: repository },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    describe("findOne", () => {
        it("should return user when found", async () => {
            repository.findById.mockResolvedValue(mockUser);

            const result = await service.findOne(1);

            expect(result).toEqual(mockUser);
            expect(repository.findById).toHaveBeenCalledWith(1);
        });

        it("should throw NotFoundException when not found", async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("create", () => {
        it("should create and return user", async () => {
            const dto = {
                email: "new@example.com",
                password: "pass123",
                name: "New",
            };
            repository.create.mockResolvedValue({ id: 2, ...dto });

            const result = await service.create(dto);

            expect(result.email).toBe(dto.email);
            expect(repository.create).toHaveBeenCalledWith(dto);
        });
    });
});
```

---

## 🎯 Resumen para la IA

Cuando generes código para este proyecto:

1. **Usa Zod v4**: `z.email()`, no `z.string().email()`
2. **Usa Vitest**: `vi.fn()`, no `jest.fn()`
3. **Usa Logger**: `this.logger.log()`, no `console.log()`
4. **Usa Drizzle**: queries con ORM, no raw SQL
5. **Tipado estricto**: `unknown` > `any`, usa `z.infer<>`
6. **Tests**: archivos `*.test.ts`, mocks con `vi.fn()`

---

## 🚨 REGLA IMPORTANTE: Nuevas Librerías

**ANTES de sugerir una librería que NO está en package.json:**

1. **AVÍSAME** que vas a usar una librería nueva
2. **EXPLICA** por qué la necesitas
3. **DAME OPCIONES** si hay alternativas
4. **ESPERA MI APROBACIÓN** antes de usarla

### Ejemplo:

```
⚠️ Para implementar esto necesito usar una librería que no está en tu proyecto:

Opciones:
1. `date-fns` - Ligera, tree-shakeable (~2KB)
2. `dayjs` - Ya la tienes instalada ✅
3. `luxon` - Más completa pero pesada (~70KB)

¿Cuál prefieres usar? Ya tienes `dayjs` instalado, recomiendo esa.
```

---

## ⚡ Rendimiento y Optimización

### Queries de Base de Datos

```typescript
// ❌ MAL - N+1 queries
const users = await db.query.users.findMany();
for (const user of users) {
    user.posts = await db.query.posts.findMany({
        where: eq(posts.userId, user.id),
    });
}

// ✅ BIEN - Una sola query con join
const users = await db.query.users.findMany({
    with: { posts: true },
});
```

### Cache Estratégico

```typescript
// ✅ Cache en capas
class UserCacheService {
    private readonly TTL = 300; // 5 minutos

    async findById(id: number) {
        const cacheKey = `user:${id}`;

        // 1. Check cache primero
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        // 2. Query DB solo si no hay cache
        const user = await this.repo.findById(id);

        // 3. Guardar en cache
        if (user) {
            await this.cache.set(cacheKey, user, this.TTL);
        }

        return user;
    }

    // ✅ Invalidar cache al modificar
    async update(id: number, dto: UpdateDto) {
        await this.cache.delete(`user:${id}`);
        return this.repo.update(id, dto);
    }
}
```

### Evitar Memory Leaks

```typescript
// ❌ MAL - Event listener sin cleanup
onModuleInit() {
    this.emitter.on('event', this.handler);
}

// ✅ BIEN - Cleanup en destroy
onModuleDestroy() {
    this.emitter.off('event', this.handler);
}
```

### Streaming para Datos Grandes

```typescript
// ❌ MAL - Cargar todo en memoria
const allUsers = await db.query.users.findMany(); // 1M registros = 💥

// ✅ BIEN - Paginación
const users = await db.query.users.findMany({
    limit: 100,
    offset: page * 100,
});

// ✅ MEJOR - Cursor pagination
const users = await db.query.users.findMany({
    where: gt(users.id, lastId),
    limit: 100,
    orderBy: asc(users.id),
});
```

### Async/Await Paralelo

```typescript
// ❌ LENTO - Secuencial
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);

// ✅ RÁPIDO - Paralelo
const [user, posts, comments] = await Promise.all([
    getUser(id),
    getPosts(id),
    getComments(id),
]);
```

---

## 🔍 Debugging Tips

```typescript
// ✅ Usar Logger con contexto
this.logger.debug(
    {
        userId,
        action: "login",
        ip: req.ip,
        duration: `${Date.now() - start}ms`,
    },
    "Login successful"
);

// ✅ Error con stack trace
try {
    await riskyOperation();
} catch (error) {
    this.logger.error(
        {
            error: error instanceof Error ? error.message : "Unknown",
            stack: error instanceof Error ? error.stack : undefined,
            context: { userId },
        },
        "Operation failed"
    );
    throw error;
}
```

---

## 📦 Librerías ya instaladas (NO instalar duplicados)

Antes de sugerir instalar algo, verifica si ya existe y siempre preguntame ¿Quieres instalarlo?:

| Funcionalidad | Librería instalada       |
| ------------- | ------------------------ |
| Fechas        | `dayjs`                  |
| Validación    | `zod`                    |
| HTTP client   | `axios`                  |
| Cache         | `cache-manager` + `keyv` |
| Logger        | `nestjs-pino`            |
| ORM           | `drizzle-orm`            |
| Testing       | `vitest`                 |
| Linting       | `@biomejs/biome`         |
| Icons         | `@vigilio/react-icons`   |

---

## 🔑 Manejo de Secretos en CI/CD (Nivel Senior)

El problema de las plataformas PAAS (Dokploy, Coolify) es que te obligan a poner secretos en su dashboard manual.

### Solución "GitOps": Inyección desde CI

En lugar de usar el dashboard, inyectamos el `.env` desde GitHub Secrets al hacer deploy.

**Workflow Recomendado:**

1.  Guardar secretos en **GitHub Repository Secrets**:
    -   `PROD_ENV_FILE`: Contenido completo del .env de producción.
2.  Usar Github Actions para crear el archivo en el servidor:

```yaml
- name: 🚀 Inject Secrets & Deploy
  uses: appleboy/ssh-action@master
  with:
      host: ${{ secrets.SERVER_IP }}
      username: ${{ secrets.SERVER_USER }}
      key: ${{ secrets.SSH_PRIVATE_KEY }}
      script: |
          # 1. Ir a la carpeta del proyecto
          cd /home/dokploy/app/my-app

          # 2. Inyectar secretos desde GitHub (seguro)
          echo "${{ secrets.PROD_ENV_FILE }}" > .env

          # 3. Recargar contenedores
          docker compose up -d --build
```

### Ventajas

1.  **Fuente Única de Verdad**: GitHub Secrets.
2.  **Backup**: Si borras el servidor, no pierdes las keys (están en GitHub).
3.  **Auditoría**: GitHub registra quién cambió los secretos.
