# 🔐 Variables de Entorno (astro:env)

Olvídate de `process.env.API_KEY` o `import.meta.env.PUBLIC_KEY` y rezar para que existan.
Astro 5 introduce `astro:env`, un sistema **tipado y validado**.

## ¿Por qué es mejor?

1.  **Validación al arrancar**: Si te falta una variable, Astro **no arranca**. (Adiós errores en producción).
2.  **Tipado TS**: `MY_SECRET` es un `string`, `PORT` es un `number`.
3.  **Seguridad**: Defines explícitamente qué es público (cliente) y qué es secreto (servidor).

## Configuración (`astro.config.mjs`)

```javascript
import { envField } from "astro/config";

export default defineConfig({
    env: {
        schema: {
            // Secreto (Solo servidor)
            API_SECRET: envField.string({
                context: "server",
                access: "secret",
            }),

            // Público (Cliente y Servidor)
            PUBLIC_API_URL: envField.string({
                context: "client",
                access: "public",
                optional: true,
            }),
        },
    },
});
```

## Uso en Código

```typescript
import { API_SECRET } from "astro:env/server"; // Solo funciona en el servidor
import { PUBLIC_API_URL } from "astro:env/client"; // Funciona en ambos

console.log(API_SECRET); // Tipado y seguro
```

## Archivo `.env`

```ini
API_SECRET=super_secreto_123
PUBLIC_API_URL=https://api.mi-saas.com
```

---

### 🧙‍♂️ Senior Tip: CI/CD Validation

Como `astro:env` valida al hacer build, tu CI (GitHub Actions) fallará si no configuras los secretos en el repositorio.
Esto es **BUENO**. Evita que despliegues una app rota.
Pero si solo quieres validar tipos sin requerir los valores reales en CI (ej: para correr tests unitarios), usa `validateSecrets: true` (default) o configúralo condicionalmente.
