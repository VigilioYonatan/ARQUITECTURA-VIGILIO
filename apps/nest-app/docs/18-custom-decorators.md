# 🎨 Decoradores Personalizados (Custom Decorators)

NestJS está construido sobre decoradores. ¡Crear los tuyos propios hace tu código mucho más limpio y expresivo!

## 🧩 Param Decorators (Decoradores de Parámetros)

El caso de uso más común: extraer al usuario autenticado del `request`.

En lugar de escribir `@Req() req` y luego `req.user` en cada controlador, creamos `@User()`.

```typescript
// common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Esto lo puso el JwtStrategy

    return data ? user?.[data] : user;
  },
);
```

### Usándolo:

```typescript
@Get('profile')
getProfile(@User() user: any) {
  return user; // { id: 1, email: '...' }
}

@Get('email')
getEmail(@User('email') email: string) {
  return email; // 'pepe@mail.com'
}
```

## 🏗️ Decoradores de Metadatos (Composition)

También puedes agrupar múltiples decoradores en uno solo.
Imagina una ruta de admin protegida. Siempre tienes que poner:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Get()
```

Puedes crear un `@AuthAdmin()` que englobe todo eso (`applyDecorators`).

```typescript
import { applyDecorators, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';

export function AuthAdmin() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
    ApiBearerAuth(),
  );
}
```

Y tu controlador queda limpiecito:

```typescript
@AuthAdmin()
@Get('users')
findAll() { ... }
```

## 💡 Best Practices

1.  **Documentación**: Los decoradores custom pueden ser "magia negra" para nuevos devs. Documenta claramente qué inyectan.
2.  **Type Safety**: Intenta mantener el tipado. Si tu decorador extrae un User, asegúrate de que el parámetro donde se usa esté tipado como `UserEntity`.
3.  **No Logic**: Al igual que los controladores, los decoradores no deberían tener lógica de negocio compleja. Solo extracción y transformación básica de datos.
