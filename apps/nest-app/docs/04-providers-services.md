# 💉 Proveedores y Servicios (Dependency Injection)

Aquí es donde ocurre la magia de NestJS. Los **Providers** son clases que pueden ser inyectadas como dependencias. La mayoría de las veces los llamamos **Servicios**.

## 🔄 Inversión de Control (IoC) explicado Fácil

> **Concepto**: No creas las instancias tú mismo (`new Service()`). Le pides a NestJS que las cree y te las dé.

**Analogía del Restaurante:**

- **Sin IoC**: Tú (el Controlador) tienes que entrar a la cocina, buscar los ingredientes y cocinar.
- **Con IoC**: Tú te sientas en la mesa y pides el plato. El Mesero (NestJS) se encarga de ir a la cocina, prepararlo y traértelo listo.

## 🛠️ Creando un Servicio

Usa el decorador `@Injectable()`. Esto le dice a Nest: "Hey, esta clase puede ser gestionada por tu contenedor IoC".

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [];

  create(user: any) {
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }
}
```

## 🔌 Inyectando el Servicio (Dependency Injection)

Para usar el servicio en un Controlador, simplemente pídelo en el **constructor**.

```typescript
// src/users/users.controller.ts
@Controller('users')
export class UsersController {
  // TypeScript ve el tipo 'UsersService' y Nest sabe qué inyectar.
  // 'private readonly' crea y asigna la propiedad automáticamente.
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll(); // ¡Listo para usar!
  }
}
```

## 🧩 ¿Cómo sabe Nest qué inyectar?

Para que esto funcione, el servicio debe estar registrado en el **Módulo**:

```typescript
// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService], // <--- ¡AQUÍ! Esto avisa a Nest que UsersService existe.
})
export class UsersModule {}
```

## 💡 Scopes (Ámbitos) Avanzados

Por defecto, los servicios son **Singletons** (una única instancia para toda la app, ahorra memoria). Pero puedes cambiarlo:

1.  **DEFAULT**: Singleton. Se crea al arrancar la app.
2.  **REQUEST**: Se crea una instancia nueva por cada petición HTTP. (Más lento, útil para multi-tenancy o guardar info del request actual).
3.  **TRANSIENT**: Se crea una instancia nueva cada vez que se inyecta en algún lado.
