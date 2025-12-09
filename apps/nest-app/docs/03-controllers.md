# 🎮 Controladores (Controllers)

Los **Controladores** son responsables de manejar las **peticiones entrantes** (Requests) y devolver las **respuestas** (Responses) al cliente. Son la puerta de entrada a tu API.

## 📡 Anatomía de un Controlador

Se define con `@Controller('ruta')`.

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users') // Ruta base: /users
export class UsersController {
  // Inyección de dependencias (veremos esto en Providers)
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // GET /users/123
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post() // POST /users
  // Define código de respuesta custom (por defecto POST es 201)
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

## 🛠️ Decoradores Comunes

| Decorador                                  | Propósito                                 | Equivalente Express          |
| :----------------------------------------- | :---------------------------------------- | :--------------------------- |
| `@Get()`, `@Post()`, `@Put()`, `@Delete()` | Define el método HTTP                     | `app.get()`, `app.post()`... |
| `@Param('id')`                             | Obtiene params de la URL (`/users/:id`)   | `req.params.id`              |
| `@Body()`                                  | Obtiene el JSON del cuerpo de la petición | `req.body`                   |
| `@Query('limit')`                          | Obtiene query params (`/users?limit=10`)  | `req.query.limit`            |
| `@Headers('auth')`                         | Obtiene headers específicos               | `req.headers.auth`           |

## 💡 Best Practices

### 1. "Skinny Controllers, Fat Services"

El controlador **NO** debe tener lógica de negocio.

- ❌ Mal: Validar si el usuario existe, hashear password y guardar en DB todo dentro del método `@Post`.
- ✅ Bien: Recibir el DTO, pasarlo al `UsersService` y retornar lo que devuelva el servicio. El controlador solo "orquesta".

### 2. Usa DTOs (Data Transfer Objects)

No uses `any` ni interfaces simples para el `@Body`. Usa **Clases** con validación (que veremos más adelante).

```typescript
export class CreateUserDto {
  name: string;
  email: string;
}
```

### 3. Respuestas Automáticas

NestJS automáticamente serializa objetos/arrays a JSON y devuelve status 200 (o 201 para POST). No hace falta hacer `res.json(...)` manualmente a menos que necesites algo muy específico de la librería subyacente (Express/Fastify).
