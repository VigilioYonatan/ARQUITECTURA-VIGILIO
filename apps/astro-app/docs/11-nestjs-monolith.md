# 🦅 NestJS + Astro: El Monolito Definitivo

Si quieres un **Monolito Real** (un solo servidor, un solo puerto), esta es la arquitectura de nivel Dios.

## La Arquitectura

-   **NestJS**: Es el "Jefe". Maneja el puerto (ej: 3000), la base de datos, la autenticación, y la API.
-   **Astro**: Es el "Motor de Vistas". Se encarga de renderizar el HTML y el CSS.

## ¿Cómo se logra?

Usando Astro en modo **Middleware**.

### 1. Configurar Astro (`apps/astro-app`)

```javascript
// astro.config.mjs
import node from "@astrojs/node";

export default defineConfig({
    output: "server",
    adapter: node({
        mode: "middleware", // <--- IMPORTANTE: No levanta servidor, solo exporta una función
    }),
});
```

### 2. El Controlador en NestJS (`apps/template-app`)

En tu app de Nest, creas un controlador que captura "todo lo que no sea API".

```typescript
// app.controller.ts
import { Controller, Get, Req, Res, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { handler as astroHandler } from "../../astro-app/dist/server/entry.mjs"; // Ruta al build de Astro

@Controller()
export class AppController {
    // Captura todas las rutas GET que no hayan sido capturadas antes (por la API)
    @Get("*")
    async renderAstro(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        // Le pasamos la pelota a Astro
        await astroHandler(req, res, next);
    }
}
```

### 3. Servir Assets Estáticos

NestJS también debe servir los archivos CSS/JS/Imágenes que genera Astro (`dist/client`).
Usas `ServeStaticModule` apuntando a `apps/astro-app/dist/client`.

## Ventajas del Monolito

1.  **Un solo Deploy**: Solo subes un contenedor Docker.
2.  **Compartir Contexto**: Puedes pasar el usuario autenticado de NestJS a Astro directamente en `locals`.
3.  **SEO Brutal**: Tienes el poder de NestJS con el SEO de Astro.

---

### 🧙‍♂️ Senior Tip: Compartir Contexto (Locals)

En tu controlador de NestJS, inyecta datos en `res.locals` antes de llamar a `astroHandler`.

```typescript
res.locals.user = req.user; // Pasamos el usuario de Passport a Astro
await astroHandler(req, res, next);
```

Luego en Astro: `const { user } = Astro.locals;`.
¡Magia! Autenticación compartida sin hacks.
