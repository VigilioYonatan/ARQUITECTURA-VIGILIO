# 🔄 Server vs Hybrid: ¿Cuál elegir?

Astro tiene dos formas de renderizar en el servidor.
La diferencia es **cuál es el comportamiento por defecto**.

## 1. Output: 'server' (Modo Dinámico)

**"Todo es dinámico, salvo que diga lo contrario".**

-   **Comportamiento**: Todas las páginas se generan en el servidor (SSR) cada vez que alguien entra.
-   **Ideal para**: Apps tipo Dashboard, Redes Sociales, E-commerce con precios en tiempo real.
-   **Cómo hacerlo estático**: Usas `export const prerender = true` en la página que quieras cachear.

```javascript
// astro.config.mjs
export default defineConfig({
    output: "server", // <--- Por defecto
    adapter: node({ mode: "standalone" }),
});
```

## 2. Output: 'hybrid' (Modo Estático con Esteroides)

**"Todo es estático, salvo que diga lo contrario".**

-   **Comportamiento**: Todo se construye como HTML estático al hacer `build` (como un sitio normal).
-   **La Magia**: Puedes elegir páginas específicas para que sean dinámicas.
-   **Ideal para**: Blogs, Portfolios, Sitios de Marketing que tienen _una_ página de contacto o login.
-   **Cómo hacerlo dinámico**: Usas `export const prerender = false` en la página que necesites.

```javascript
// astro.config.mjs
export default defineConfig({
    output: "hybrid", // <--- La opción inteligente
    adapter: node({ mode: "standalone" }),
});
```

## Ejemplo Práctico

Imagina un Blog con Login.

-   **Home, About, Artículos**: Son estáticos (Rápidos, baratos).
-   **Login, Perfil**: Son dinámicos (SSR).

**Configuración recomendada (`hybrid`)**:

```javascript
// src/pages/login.astro
export const prerender = false; // <--- Solo esta página será SSR
```

---

### 🧙‍♂️ Senior Tip: Edge Caching

Aunque uses SSR, no tienes que renderizar CADA request.
Usa headers de caché para que el CDN (Vercel/Cloudflare) guarde la respuesta por unos segundos.

```typescript
Astro.response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60");
```

Esto reduce la carga en tu servidor/lambda en un 99% durante picos de tráfico.
