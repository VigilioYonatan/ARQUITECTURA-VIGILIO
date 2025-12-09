# 🧩 Módulos en NestJS

Los **Módulos** son la forma en que NestJS organiza la estructura de la aplicación. Piensa en ellos como "cajas de lego" que agrupan controladores y servicios relacionados.

## 📝 El Decorador `@Module`

Un módulo es una clase anotada con `@Module()`. Este decorador toma un objeto que describe el módulo:

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController], // Controladores que pertenecen a este módulo
  providers: [UsersService], // Servicios disponibles DENTRO de este módulo
  exports: [UsersService], // Servicios que este módulo "comparte" para que otros los usen
  imports: [], // Otros módulos que este módulo necesita
})
export class UsersModule {}
```

## 🔍 Conceptos Clave

1.  **Encapsulamiento**: Por defecto, los `providers` (servicios) son privados. Si quieres usar `UsersService` en `AuthModule`, debes ponerlo en el array `exports` de `UsersModule`.
2.  **Singleton**: Los módulos son singletons. NestJS reutiliza la misma instancia del módulo en toda la app.

## 💡 Best Practices

### 1. Feature Modules (Módulos de Funcionalidad)

Crea un módulo por cada dominio o recurso de tu negocio: `UsersModule`, `ProductsModule`, `OrdersModule`. No metas todo en `AppModule`.

### 2. Shared Module (Módulo Compartido)

Si tienes utilidades que se usan en todos lados (ej. un servicio de formateo de fechas), crea un `SharedModule`, exporta el servicio, e impórtalo donde lo necesites.

> [!WARNING]
> **Evita las dependencias circulares**. Si Módulo A importa Módulo B, y Módulo B importa Módulo A, la app fallará o será difícil de debuggear. Usa `forwardRef()` solo si es estrictamente necesario, pero mejor refactoriza.

### 3. Global Modules

Si tienes un módulo que quieres que esté disponible en TODA la app sin importarlo en cada sitio (como config de DB), usa `@Global()`.

```typescript
@Global()
@Module({ ... })
export class DatabaseModule {}
```

_Tip: Úsalo con moderación para no "contaminar" el scope global._
