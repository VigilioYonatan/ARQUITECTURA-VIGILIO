# 🕵️ Interceptores (Interceptors)

Los **Interceptores** son muy poderosos. Son como el "Middleware" pero con superpoderes: pueden manipular **lo que entra** (antes del handler) y **lo que sale** (después del handler).

Forman parte del patrón AOP (Aspect Oriented Programming).

## 🚀 Usos Comunes

1.  **Transformar respuesta final** (ej. envolver todo en `{ data: ... }`).
2.  **Logging** (medir cuánto tardó una petición).
3.  **Caching** (devolver una respuesta guardada sin ejecutar el handler).

## 🛠️ Ejemplo: Transformar Respuesta

Imagina que quieres excluir el campo `password` de todas las respuestas User automáticamente.

```typescript
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  @Get()
  findOne() {
    return new UserEntity({ ... });
  }
}
```

En tu `UserEntity`:

```typescript
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;

  @Exclude() // 👈 Esto lo oculta mágicamente al salir
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

## ⏱️ Ejemplo: Logging de Tiempo

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle() // Ejecuta el controlador
      .pipe(tap(() => console.log(`La petición tardó: ${Date.now() - now}ms`)));
  }
}
```

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // 1. Usamos el Logger de NestJS (permite desactivar logs en prod si es necesario)
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 2. Obtenemos datos útiles de la petición
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method; // GET, POST...
    const url = request.url; // /users, /auth...

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // 3. Logueamos con contexto: "¿Qué ruta fue y cuánto tardó?"
        const time = Date.now() - now;
        this.logger.log(`${method} ${url} \x1b[33m+${time}ms\x1b[0m`);
      }),
    );
  }
}
```

## 💡 Best Practices

1.  **Ligereza**: Los interceptores se ejecutan en CADA petición. Evita operaciones pesadas (llamadas a DB lentas) aquí.
2.  **Scope Correcto**: Usa interceptores globales solo para cosas universales (Logging, Transformación de Response estándar). Para lógica específica, úsalos a nivel de Controlador o Método.
