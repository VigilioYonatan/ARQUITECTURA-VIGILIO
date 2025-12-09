# 🛡️ Guards (Guardias)

Los **Guards** son la única línea de defensa de tus rutas. Reciben el contexto de ejecución y devuelven `true` (pasa) o `false` (bloqueado, 403 Forbidden).

## 🛠️ Guard de Autenticación (`JwtAuthGuard`)

Usando `@nestjs/passport` es muy fácil:

```typescript
// auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Aplicándolo en un controlador:

```typescript
@UseGuards(JwtAuthGuard) // 🔒 Todo esto está protegido
@Controller('profile')
export class ProfileController { ... }
```

## 👮 Guard de Roles (RolesGuard)

Imagina que solo usuarios con rol 'ADMIN' pueden entrar.

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Leer metadata (roles requeridos) del handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true; // Si no pide roles, pasa

    // 2. Obtener el usuario (inyectado previamente por AuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. Verificar si el usuario tiene el rol
    return roles.includes(user.roles);
  }
}
```

> [!NOTE]
> Para usar metadata, necesitas crear un decorador `@Roles('admin')` custom (ver temas avanzados).

## 💡 Best Practices

1.  **Global Guards**: Si el 90% de tu API es privada, usa `APP_GUARD` para proteger todo por defecto y usa un decorador `@Public()` (custom) para abrir endpoints específicos (Login/Register).
2.  **Jerarquías**: Evita lógica compleja en los Guards. Si necesitas revisar permisos granulares ("puede editar posts propios"), considera usar **CASL** (Authorization Library) dentro de tu Servicio, no solo Guards.
