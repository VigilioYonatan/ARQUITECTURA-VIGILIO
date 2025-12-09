# 🚨 Filtros de Exceptión (Exception Filters)

NestJS maneja los errores automáticamente, pero a veces quieres controlar _cómo_ se ven esos errores o capturar excepciones específicas (como errores de DB).

## 🛑 El Manejo por Defecto

Si lanzas una excepción estándar:

```typescript
throw new HttpException('Algo salió mal', HttpStatus.FORBIDDEN);
```

Nest devuelve:

```json
{
  "statusCode": 403,
  "message": "Algo salió mal"
}
```

## 🎨 Creando un Filtro Custom

Imagina que quieres que TODOS tus errores, sin importar de donde vengan, tengan un `timestamp`.

```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(), // ✨ Nuestro toque personal
      path: request.url,
      message: exception.message,
    });
  }
}
```

## 🔌 Aplicándolo

- **Global**: `app.useGlobalFilters(new HttpExceptionFilter());` en `main.ts`
- **Controller**: `@UseFilters(HttpExceptionFilter)` sobre la clase o método.

## 💡 Best Practices

Usa filtros para mapear errores "feos" de terceros (como un error de clave duplicada de Prisma/TypeORM) a errores HTTP amigables (ej. `409 Conflict`).
