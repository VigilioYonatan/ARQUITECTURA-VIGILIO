# 📦 DTOs (Data Transfer Objects)

Los **DTOs** son uno de los conceptos más importantes para mantener tu aplicación robusta y segura. Definen **qué datos** se envían por la red y cómo deben lucir.

## 🤔 ¿Por qué usar DTOs?

Imagina que tienes una API para crear usuarios. Sin un DTO, recibes un objeto `any` o un JSON sin forma.

- ¿Qué pasa si te envían un campo `isModel: true` que no esperabas?
- ¿Qué pasa si falta el `email`?

El DTO es el "contrato" que asegura que la información que entra (o sale) es correcta.

## 🛠️ Creando un DTO

Un DTO es simplemente una **Clase** (no uses Interfaces, ya que las interfaces desaparecen al compilar a JS, pero las Clases se mantienen y permiten usar decoradores).

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  age: number;
}
```

## ✅ Validación Automática (Nivel 2 Spoiler)

Aunque la validación es parte del "Nivel 2", es imposible hablar de DTOs sin mencionarla. Usando `class-validator`:

```typescript
import { IsString, IsEmail, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

## 🔄 Usándolo en el Controlador

```typescript
// src/users/users.controller.ts
@Post()
create(@Body() createUserDto: CreateUserDto) {
  // Aquí createUserDto ya tiene la estructura correcta
  // Si usas ValidationPipe global, ¡incluso ya está validado!
  return this.usersService.create(createUserDto);
}
```

## 💡 Mapped Types (Tipos Parciales)

Para actualizar datos (PATCH), no quieres reescribir todo el DTO. NestJS ofrece `PartialType`:

```typescript
// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Ojo: instalar @nestjs/mapped-types
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// Esto hace que todos los campos de CreateUserDto sean opcionales automáticamente.
```

## 💡 Best Practices

1.  **Imputabilidad**: Los DTOs deben ser de solo lectura. Evita métodos dentro de ellos, son solo contenedores de datos.
2.  **Un DTO por Caso de Uso**: No reuses el mismo DTO para Crear y Editar si tienen reglas distintas (ej. el ID es obligatorio en update pero prohibido en create).
3.  **Exponer solo lo necesario**: En los DTOs de salida (Response DTOs), usa `class-transformer` con `@Exclude()` para nunca filtrar datos sensibles por error.
