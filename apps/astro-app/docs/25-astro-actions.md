# ⚡ Astro Actions: El Fin de `fetch()`

**Astro Actions** es la forma moderna de comunicar tu Frontend (Islas) con tu Backend.
Olvídate de crear archivos `pages/api/route.ts` y llamar a `fetch('/api/route')`.

## ¿Qué es?

Es **RPC (Remote Procedure Call)**.
Defines una función en el backend, y la importas en el frontend como si fuera una función local.
Astro se encarga de la magia (serialización, red, errores).

## Ventajas vs API Endpoints

| Característica | API Endpoint (`pages/api`)                  | Astro Action (`src/actions`)                           |
| :------------- | :------------------------------------------ | :----------------------------------------------------- |
| **Llamada**    | `fetch('/api/user', { method: 'POST'... })` | `actions.user.create({ name: 'Juan' })`                |
| **Tipado**     | Manual (tienes que tipar la respuesta)      | **Automático** (Zod infiere tipos de entrada y salida) |
| **Validación** | Manual (`if (!body.name)...`)               | **Automática** (Zod valida antes de ejecutar)          |
| **Errores**    | Manual (`res.status(400)`)                  | **Automático** (`isInputError`, `error`)               |

## ¿Cómo se usa?

1.  **Define la Acción** (`src/actions/index.ts`):

    ```typescript
    import { defineAction, z } from "astro:actions";

    export const server = {
        subscribe: defineAction({
            input: z.object({ email: z.string().email() }),
            handler: async (input, context) => {
                // Lógica de backend (Base de datos, Email, etc.)
                return {
                    success: true,
                    message: `Email ${input.email} guardado`,
                };
            },
        }),
    };
    ```

2.  **Úsala en el Cliente** (React/Preact/Svelte):

    ```typescript
    import { actions } from "astro:actions";

    async function onSubmit() {
        const { data, error } = await actions.subscribe({
            email: "test@test.com",
        });
        if (error) console.error(error);
        else console.log(data.message);
    }
    ```

---

### 🧙‍♂️ Senior Tip: Progressive Enhancement

Las Actions funcionan **sin JavaScript** si usas formularios HTML estándar.

```astro
<form method="POST" action={actions.subscribe}>
  <input name="email" />
  <button>Enviar</button>
</form>
```

Astro intercepta el submit. Si hay JS, usa `fetch`. Si no hay JS, hace un POST clásico y recarga la página.
¡Tu app funciona incluso si el CDN de JS se cae!
