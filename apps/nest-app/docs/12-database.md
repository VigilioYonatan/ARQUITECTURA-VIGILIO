# 🗄️ Base de Datos con Prisma

NestJS es agnóstico a la DB, pero **Prisma** es el estándar moderno en la comunidad de Node.js por su tipado fuerte.

## 🛠️ Setup

1.  Instalar Prisma:
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    npx prisma init
    ```
2.  Configurar tu `schema.prisma` y `.env`.

## 🔌 El PrismaService

Para usar Prisma en Nest, necesitamos un Servicio que se conecte:

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

No olvides crear un módulo global para exportarlo:

```typescript
// src/prisma/prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## 🚀 Usándolo en un Servicio

```typescript
// users.service.ts
constructor(private prisma: PrismaService) {}

async create(data: CreateUserDto) {
  return this.prisma.user.create({
    data: data,
  });
}
```

> [!TIP]
> **TypeORM** es la alternativa clásica. Usa decoradores en las clases (`@Entity()`) en lugar de un archivo `schema.prisma`. Es más similar a Hibernate o Entity Framework de Java/C#. Prisma es más moderno y tiene mejor DX (Developer Experience).

## 💡 Best Practices

1.  **No lógica en el Controller**: Nunca llames a `prisma.user.findMany()` desde el controlador. Pasa siempre por el Servicio.
2.  **DTOs de Salida**: Prisma devuelve el objeto con TODOS los campos (incluido password). Usa `class-transformer` (`@Exclude`) o selecciona campos en la query (`select: { id: true, name: true }`) para no fugar datos.
3.  **Transacciones**: Usa `prisma.$transaction([])` cuando tengas operaciones dependientes (ej. Crear Usuario y Crear Configuración) para que fallar una revierta todo.
