# 🏯 Arquitectura Hexagonal (Clean Architecture)

El objetivo: que tu lógica de negocio (Dominio) no dependa de NestJS, ni de la base de datos, ni de HTTP.

## 🧅 Las Capas

1.  **Dominio (Núcleo)**: Entidades y Lógica de Negocio pura. (No frameworks).
2.  **Aplicación (Casos de Uso)**: "Orquesta" el dominio. Llama a puertos (interfaces). `CreateUserUseCase`.
3.  **Adpatadores (Infraestructura)**: Implementaciones reales. `PostgresUserRepository`, `HttpController`.

## 🔌 Puertos y Adaptadores

NestJS nos ayuda con la DI para conectar esto.

### Dominio (Core)

```typescript
// domain/user.ts
export class User {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

// domain/user.repository.ts (PUERTO)
// Es una interfaz abstracta, NO la implementación
export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
}
```

### Infraestructura (Adaptador)

```typescript
// infra/prisma-user.repository.ts
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User) {
    // Convierte modelo de dominio a modelo de DB
    await this.prisma.user.create({ data: user });
  }
}
```

### Module (Wiring)

Aquí conectamos todo: "Cuando alguien pida `UserRepository`, dale `PrismaUserRepository`".

```typescript
@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase, // El caso de uso usa UserRepository
  ],
})
export class UserModule {}
```

## 💡 Best Practices

1.  **Regla de Dependencia**: La capa de Dominio **NUNCA** debe importar nada de Infraestructura ni de NestJS (`@nestjs/common`). Si ves un `import` de Prisma en tu Entidad de Dominio, has roto la arquitectura.
2.  **Mappers**: Necesitarás mappers para convertir `UserEntity` (DB) <-> `User` (Dominio) <-> `UserDto` (API). Es tedioso pero necesario para el desacoplamiento real.
3.  **Pragmatismo**: No uses Hexagonal para un CRUD simple. Añade mucha complejidad. Úsalo solo en el "Core" de tu negocio donde la lógica es compleja y cambiante.
