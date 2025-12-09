# 🚂 Astro + Express.js

¿Quieres usar Express para tus APIs? ¡Se puede!
Tienes dos caminos:

## 1. El Camino "Nativo" (Recomendado)

Astro ya tiene un sistema de API potente (`src/pages/api/*.ts`).
Usa **Estándares Web** (Request/Response) en lugar de los objetos de Express (`req`, `res`).

-   **Ventaja**: Todo en un solo proyecto, deploy fácil.
-   **Desventaja**: No puedes usar middlewares de Express (`app.use()`) directamente.

## 2. El Camino "Custom Server" (Lo que pides)

Puedes crear tu propio servidor Express y usar Astro como un "middleware" para renderizar el frontend.

### Pasos:

1.  Cambia tu `astro.config.mjs` a `middleware`.
2.  Crea un archivo `server.mjs`.

```javascript
// server.mjs
import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs"; // Generado por Astro

const app = express();

// 1. Tus APIs de Express (¡Lo que querías!)
app.get("/api/express-hello", (req, res) => {
    res.json({ message: "Hola desde Express puro!" });
});

// 2. Astro maneja el resto (Frontend)
app.use(express.static("dist/client/"));
app.use((req, res, next) => {
    const locals = {
        /* Puedes pasar datos de Express a Astro aquí */
    };
    ssrHandler(req, res, next, locals);
});

app.listen(4321, () => {
    console.log("Servidor Express + Astro corriendo en http://localhost:4321");
});
```

### ¿Cómo configurar Astro para esto?

En `astro.config.mjs`:

```javascript
import node from "@astrojs/node";

export default defineConfig({
    output: "server",
    adapter: node({
        mode: "middleware", // <--- ESTO ES LA CLAVE
    }),
});
```

### Conclusión

-   Si solo necesitas unas pocas APIs: Usa **Astro API Routes**.
-   Si tienes un backend complejo en Express existente: Usa el método **Custom Server**.

---

### 🧙‍♂️ Senior Tip: Middleware Mode vs Standalone

Si usas `mode: 'middleware'`, pierdes algunas optimizaciones de Astro (como el manejo automático de assets estáticos optimizados por el adaptador).
Asegúrate de configurar bien `app.use(express.static('dist/client'))` y cachear agresivamente esos assets en tu servidor Express o Nginx reverso.
