# ✅ Validación (ValidationPipe)

La validación es crítica. NestJS hace esto muy fácil usando `class-validator` y `class-transformer` junto con un `Pipe` global.

## 🛠️ Setup Inicial

Necesitas instalar las dependencias:

```bash
npm install class-validator class-transformer
```

Y activar el `ValidationPipe` global en `main.ts`:

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // 💡 IMPORTANTE: Elimina propiedades que no estén en el DTO (seguridad)
    forbidNonWhitelisted: true, // Lanza error si envían propiedades extra
    transform: true, // Transforma los payloads a instancias de la clase DTO
  }),
);
```

## 📝 Decoradores Comunes

En tus DTOs (`create-user.dto.ts`):

```typescript
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export class CreateUserDto {
  @IsString()
  @MinLength(3) // Mensaje de error automático si es muy corto
  name: string;

  @IsEmail({}, { message: 'El correo no es válido pz' }) // Mensaje custom
  email: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
```

## 💡 Best Practices

1.  **Whitelist siempre**: Evita la "inyección masiva" de parámetros. Si tu DTO no tiene `isAdmin`, y un hacker envía `isAdmin: true`, `whitelist: true` lo elimina silenciosamente.
2.  **Transform**: Activar `transform: true` es muy útil. Convierte automáticamente los JSON planos que llegan por red en instancias reales de tus clases DTO.
