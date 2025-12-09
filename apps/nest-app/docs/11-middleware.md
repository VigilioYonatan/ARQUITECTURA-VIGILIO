# 🚧 Middleware

El **Middleware** es una función que corre **antes** de que la petición llegue a ningún sitio (incluso antes que los Guards o Interceptors). Es el mismo concepto de Express.js.

Sirve para: Logs básicos, parsear cookies, headers de seguridad (Helmet), etc.

## 🛠️ Creando Middleware

```typescript
// common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.url}`);
    next(); // ⚠️ ¡Importante llamar a next() o se cuelga!
  }
}
```

## 🔌 Configurando Middleware

A diferencia de otros componentes, el middleware se configura en el `configure()` del Módulo, no en los arrays de `providers`.

```typescript
// app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users'); // Solo para rutas que empiecen con 'users'
    // O para todo: .forRoutes('*')
  }
}
```

## 🧠 Middleware vs Guard vs Interceptor

- **Middleware**: "Bajo nivel", Express puro. Bueno para cosas globales como CORS, Logs HTTP, Body Parsers.
- **Guard**: Decisión de SI o NO (Autorización). Tiene acceso al contexto de Nest.
- **Interceptor**: Manipula Entrada y Salida.
- **Pipe**: Transforma y Valida Argumentos.

**Orden de Ejecución:**

1. Middleware
2. Guards
3. Interceptors (Pre)
4. Pipes
5. Controller (Handler)
6. Interceptors (Post)
7. Filters (si hubo error)

## 💡 Best Practices

1.  **Framework Agnostic**: Trata de que tu Middleware no dependa demasiado de APIs específicas de Express si planeas cambiar a Fastify.
2.  **Seguridad**: Usa middleware estándar como `helmet` y `cors` para la seguridad básica. No reinventes la rueda.
3.  **No Lógica de Negocio**: Jamás inyectes Servicios complejos en Middleware. Úsalos solo para tareas de transporte HTTP (Headers, Cookies, IP Whitelist).
