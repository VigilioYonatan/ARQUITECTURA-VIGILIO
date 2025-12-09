# 🛡️ Astro Middleware: El Portero de tu App

El middleware es código que se ejecuta **antes** de que Astro renderice cualquier página o endpoint.
Es el lugar perfecto para:

-   Autenticación (Proteger rutas).
-   Validación de datos.
-   Inyección de información del usuario (`locals`).

## 1. Creando el Middleware

Crea `src/middleware.ts`. Debe exportar una función `onRequest`.

```typescript
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    console.log("Petición entrante:", context.url.pathname);

    // Continuar con la siguiente etapa
    return next();
});
```

## 2. Locals: Pasando Datos a la Página

El objeto `context.locals` vive durante toda la petición.
Puedes escribir en él en el middleware y leerlo en tus páginas `.astro`.

**En el Middleware:**

```typescript
context.locals.user = { name: "Juan", role: "admin" };
```

**En la Página (`dashboard.astro`):**

```astro
---
const user = Astro.locals.user;
---
<h1>Hola {user.name}</h1>
```

## 3. Tipado Seguro (`env.d.ts`)

Para que TypeScript no se queje, debes definir la forma de `locals` en `src/env.d.ts`.

```typescript
declare namespace App {
    interface Locals {
        user: { name: string; role: string } | null;
    }
}
```

## 4. Encadenando Middlewares (`sequence`)

Si tienes mucha lógica, divídela en funciones y únelas con `sequence`.

```typescript
import { sequence } from "astro:middleware";

async function auth(ctx, next) { ... }
async function logging(ctx, next) { ... }

export const onRequest = sequence(auth, logging);
```

---

### 🧙‍♂️ Senior Tip: Middleware Performance

El middleware corre en **CADA** request (incluso assets estáticos si no tienes cuidado en algunos adaptadores).
Siempre verifica `context.url.pathname` al principio y sal temprano si no te interesa la ruta.

```typescript
if (context.url.pathname.startsWith("/_image")) return next(); // Ignora optimización de imágenes
if (context.url.pathname.includes(".")) return next(); // Ignora archivos (css, js)
```

Esto ahorra milisegundos valiosos.
