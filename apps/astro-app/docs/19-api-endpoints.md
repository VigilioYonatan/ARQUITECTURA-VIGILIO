# 📡 API Endpoints en Astro

Astro no es solo para HTML. También es un backend completo.
Puedes crear archivos `.ts` (o `.js`) en `src/pages` que retornen JSON, XML, o imágenes.

## Estructura Básica

Crea un archivo en `src/pages/api/hola.ts`.

```typescript
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
    return new Response(
        JSON.stringify({
            mensaje: "¡Hola mundo!",
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};
```

## Métodos HTTP

Simplemente exporta funciones con el nombre del método: `GET`, `POST`, `PUT`, `DELETE`, `ALL`.

```typescript
export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    // ... guardar en base de datos ...

    return new Response(JSON.stringify({ success: true }), { status: 201 });
};
```

## Contexto

La función recibe un objeto `context` (igual que `Astro.props` en páginas):

-   `params`: Parámetros de ruta dinámica (ej: `[id].ts`).
-   `request`: La petición estándar (Web Request).
-   `cookies`: Para leer/escribir cookies.
-   `redirect`: Para redirigir.

## Static vs Server

-   **output: 'static'**: Los endpoints se ejecutan **al momento del build** y generan archivos `.json` estáticos.
-   **output: 'server'**: Los endpoints se ejecutan **en cada petición**.

---

### 🧙‍♂️ Senior Tip: Type-Safe Responses

No retornes `new Response(JSON.stringify(...))`. Es propenso a errores y no tiene tipos.
Usa una utilidad helper:

```typescript
// src/utils/api.ts
export function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

// Uso
export const GET: APIRoute = () => json({ hello: "world" });
```

Mucho más limpio y seguro.
