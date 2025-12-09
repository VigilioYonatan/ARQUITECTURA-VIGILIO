# Testing en NestJS 🧪

El testing es ciudadano de primera clase en NestJS. El framework viene configurado por defecto con **Jest** y **Supertest**.

## Tipos de Tests

En una arquitectura robusta, distinguimos 3 niveles de tests:

| Tipo                 | Alcance                                                                | Velocidad      | Herramientas         |
| :------------------- | :--------------------------------------------------------------------- | :------------- | :------------------- |
| **Unitarios**        | Prueban una sola función o clase aislada. Todo lo externo se "Mockea". | ⚡️ Muy rápidos | Jest                 |
| **Integración**      | Prueban la interacción entre varios módulos o con la Base de Datos.    | 🐢 Medios      | Jest, TestContainers |
| **End-to-End (E2E)** | Levantan la app completa y simulan peticiones HTTP reales.             | 🐌 Lentos      | Supertest, Pactum    |

---

## 1. Unit Testing (Pruebas Unitarias)

El objetivo es probar la lógica de negocio de un Servicio sin tocar la base de datos ni dependencias externas.

**Ejemplo: `UsersService`**

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  // Mock del Repository
  const mockUserRepository = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Proveer el Mock en lugar del real
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { name: 'John' };
    expect(await service.create(dto)).toEqual({ id: 1, name: 'John' });

    // Verificar que se llamó al repositorio
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});
```

> **💡 Clave:** Usar `useValue` o `useFactory` para inyectar los Mocks. Nunca uses el Repository real aquí.

---

## 2. Integration Testing

Aquí queremos probar que nuestros módulos se hablan bien entre sí, o que una query compleja a base de datos funciona.

Suelen requerir una base de datos de prueba (Docker es ideal para esto).

Un Test de Integración verifica que **varias piezas funcionen juntas**. A diferencia del Unit Test (donde mockeamos todo), aquí usamos los módulos reales.

**Ejemplo: `UsersService` + `Prisma` (Base de Datos Real/Test DB)**

En este caso, importamos el `UsersModule` real y verificamos que al llamar al servicio, los datos realmente se guarden en la base de datos (usando una DB de test, SQLite en memoria o Docker).

```typescript
// test/users.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UsersIntegration', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    // 1️⃣ Creamos el módulo importando el UsersModule REAL
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // Limpiar DB antes de cada test para evitar conflictos
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('create() should persist data in the database', async () => {
    // A diferencia del unit test, aquí NO mockeamos el repositorio.
    // Realmente se inserta en la DB.

    // Act
    const newUser = await service.create({
      email: 'real@email.com',
      name: 'Real User',
    });

    // Assert (Verificar resultado del servicio)
    expect(newUser.id).toBeDefined();

    // Assert (Verificar efecto colateral directo en DB)
    const savedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
    });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.email).toBe('real@email.com');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
```

> **Nota:** Para esto necesitas una Base de Datos de prueba corriendo (ej. en Docker o SQLite) y apuntar tu `.env.test` a ella.

---

## 3. End-to-End (E2E) Testing

NestJS usa la librería `supertest` para simular peticiones HTTP contra la aplicación levantada.

El archivo suele estar en la carpeta `test/` fuera de `src/`.

**Ejemplo: `app.e2e-spec.ts`**

````typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
# Testing en NestJS 🧪

El testing es ciudadano de primera clase en NestJS. El framework viene configurado por defecto con **Jest** y **Supertest**.

## Tipos de Tests

En una arquitectura robusta, distinguimos 3 niveles de tests:

| Tipo                 | Alcance                                                                | Velocidad      | Herramientas         |
| :------------------- | :--------------------------------------------------------------------- | :------------- | :------------------- |
| **Unitarios**        | Prueban una sola función o clase aislada. Todo lo externo se "Mockea". | ⚡️ Muy rápidos | Jest                 |
| **Integración**      | Prueban la interacción entre varios módulos o con la Base de Datos.    | 🐢 Medios      | Jest, TestContainers |
| **End-to-End (E2E)** | Levantan la app completa y simulan peticiones HTTP reales.             | 🐌 Lentos      | Supertest, Pactum    |

---

## 1. Unit Testing (Pruebas Unitarias)

El objetivo es probar la lógica de negocio de un Servicio sin tocar la base de datos ni dependencias externas.

**Ejemplo: `UsersService`**

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  // Mock del Repository
  const mockUserRepository = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Proveer el Mock en lugar del real
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { name: 'John' };
    expect(await service.create(dto)).toEqual({ id: 1, name: 'John' });

    // Verificar que se llamó al repositorio
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});
````

> **💡 Clave:** Usar `useValue` o `useFactory` para inyectar los Mocks. Nunca uses el Repository real aquí.

---

## 2. Integration Testing

Aquí queremos probar que nuestros módulos se hablan bien entre sí, o que una query compleja a base de datos funciona.

Suelen requerir una base de datos de prueba (Docker es ideal para esto).

Un Test de Integración verifica que **varias piezas funcionen juntas**. A diferencia del Unit Test (donde mockeamos todo), aquí usamos los módulos reales.

**Ejemplo: `UsersService` + `Prisma` (Base de Datos Real/Test DB)**

En este caso, importamos el `UsersModule` real y verificamos que al llamar al servicio, los datos realmente se guarden en la base de datos (usando una DB de test, SQLite en memoria o Docker).

```typescript
// test/users.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UsersIntegration', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    // 1️⃣ Creamos el módulo importando el UsersModule REAL
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // Limpiar DB antes de cada test para evitar conflictos
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('create() should persist data in the database', async () => {
    // A diferencia del unit test, aquí NO mockeamos el repositorio.
    // Realmente se inserta en la DB.

    // Act
    const newUser = await service.create({
      email: 'real@email.com',
      name: 'Real User',
    });

    // Assert (Verificar resultado del servicio)
    expect(newUser.id).toBeDefined();

    // Assert (Verificar efecto colateral directo en DB)
    const savedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
    });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.email).toBe('real@email.com');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
```

> **Nota:** Para esto necesitas una Base de Datos de prueba corriendo (ej. en Docker o SQLite) y apuntar tu `.env.test` a ella.

---

## 3. End-to-End (E2E) Testing

NestJS usa la librería `supertest` para simular peticiones HTTP contra la aplicación levantada.

El archivo suele estar en la carpeta `test/` fuera de `src/`.

**Ejemplo: `app.e2e-spec.ts`**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## ⚖️ ¿Son obligatorios los 3 tipos de test?

**No, no son obligatorios.** Depende de la etapa tu proyecto (ROI - Retorno de Inversión).

| Tipo de Proyecto         | Estrategia Recomendada                       | ¿Por qué?                                                                                                                              |
| :----------------------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Startup / MVP**        | **80% E2E / Integración** <br> 20% Unitarios | Necesitas saber que "el Login funciona". Si el código es feo, no importa tanto como que funcione. Los E2E te dan esa seguridad rápido. |
| **Enterprise / FinTech** | **40% Unit / 40% Int / 20% E2E**             | La lógica de negocio (intereses, balances) es crítica y compleja. Necesitas Unit Tests para cubrir todos los casos borde (edge cases). |
| **Microservicios**       | **Contract Testing (Pact)**                  | Importante asegurar que no rompes la API para otros servicios.                                                                         |

### 🔥 Regla de Oro (Test Trophy)

En aplicaciones modernas de backend, a menudo **los Tests de Integración dan el mayor valor**.

- Los Unitarios a veces son frágiles (si cambias la implementación privada, se rompen).
- Los E2E son muy lentos.
- **Integración** es el punto dulce: prueba que tu código funciona con la DB real sin ser tan lento como levantar toda la app.

### 🏢 En Proyectos Grandes (Enterprise)

**SÍ, rotundo.** Aquí necesitas los 3 niveles obligatoriamente.

1.  **Unitarios (Velocidad de Desarrollo):**
    - En un proyecto grande, levantar la app tarda mucho.
    - Si un developer cambia una regla de negocio compleja, necesita saber en **milisegundos** si rompió algo. Solo los Unit Tests dan esa velocidad.
2.  **Integración (Contrato de Módulos):**
    - Como hay muchos equipos tocando código, es fácil romper queries o contratos entre módulos.
3.  **E2E (QA Automatizado):**
    - Antes de desplegar a producción (CI/CD), los E2E son tu "red de seguridad" final.

**Pipeline Típico en Enterprise:**

1.  Developer corre **Unit Tests** localmente (tardan segundos).
2.  Al hacer Push, el CI corre **Integration Tests** (tardan minutos).
3.  Antes del Merge/Deploy, el CI corre **E2E** (tardan 10-20 min).

## 🔥 Best Practices para Testing 2026

1.  **Testea lo que rompe el negocio:** No pierdas tiempo testeando Getters/Setters simples. Testea la lógica de calcular precios, permisos, flujos de estado.
2.  **Builder Pattern para datos de prueba:** No crees objetos JSON gigantes en cada test. Usa un `UserBuilder`.
3.  **No dependas de datos globales:** Cada test debe crear sus propios datos y limpiarlos (o usar una DB en memoria/transacción que se revierte).
4.  **Usa `jest --watch`:** Mientras programas, mantén los tests corriendo.
