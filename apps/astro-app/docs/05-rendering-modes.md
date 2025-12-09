# 🖥️ Modos de Renderizado (Rendering Modes)

Astro es muy flexible y te permite elegir cómo y cuándo se genera tu HTML.

## 1. SSG (Static Site Generation) - _El Default_

-   **¿Cuándo se genera?**: Una sola vez, en el momento del "build" (`npm run build`).
-   **Ventajas**: Es lo más rápido posible. El servidor solo entrega archivos HTML ya listos.
-   **Desventajas**: Si cambian los datos, tienes que reconstruir el sitio. **NO se actualiza solo.**
-   **Uso ideal**: Blogs, Portafolios, Documentación.

> **¿Quieres que se actualice solo cada X tiempo?**
> Eso no es SSG puro, eso se llama **ISR** (ver punto 4).

## 2. SSR (Server-Side Rendering)

-   **¿Cuándo se genera?**: En cada petición (request) del usuario.
-   **Ventajas**: Datos siempre frescos. Puedes acceder a cookies, headers, y autenticación de usuarios.
-   **Desventajas**: Requiere un servidor (Node.js, Deno, Bun) y es un poco más lento que SSG (porque tiene que "pensar" antes de responder).
-   **Uso ideal**: Dashboards, Tiendas con stock en tiempo real, Redes Sociales.

---

## 🚀 ¿Existen más modos? ¡SÍ!

### 3. Hybrid Rendering (Híbrido)

Es la mezcla perfecta. Tu sitio es **SSR** por defecto, pero puedes marcar ciertas páginas como **prerenderizadas (SSG)** para que sean ultra rápidas.

```astro
// src/pages/about.astro
export const prerender = true; // Esta página será estática (SSG)
// El resto del sitio seguirá siendo dinámico (SSR)
```

### 4. ISR (Incremental Static Regeneration)

_Nota: En Astro esto se logra con adaptadores específicos (como Vercel o Netlify)._
Permite reconstruir páginas estáticas en segundo plano sin tener que hacer un deploy completo.

---

## 🔌 Adaptadores (Adapters)

Para usar SSR, necesitas un adaptador que "traduzca" tu sitio al servidor donde lo alojarás.

| Adaptador                 | Uso Ideal                                  |
| :------------------------ | :----------------------------------------- |
| **`@astrojs/node`**       | Servidores propios (VPS), Docker, AWS EC2. |
| **`@astrojs/vercel`**     | Despliegue en Vercel (Serverless / Edge).  |
| **`@astrojs/netlify`**    | Despliegue en Netlify.                     |
| **`@astrojs/cloudflare`** | Despliegue en Cloudflare Pages (Edge).     |

**¿Cuál es el mejor?**
Depende de tu hosting. Si usas Docker (como en este curso), **Node.js** es el rey.

---

## 🔎 SEO: ¿Cuál es mejor?

**Respuesta Corta: TODOS son excelentes en Astro.**
A diferencia de React puro (CRA) que envía una página en blanco, Astro **siempre envía HTML**, sin importar el modo.

| Modo                 | Velocidad (TTFB)     | SEO        | Comentarios                                                        |
| :------------------- | :------------------- | :--------- | :----------------------------------------------------------------- |
| **SSG**              | ⚡⚡⚡ (Instantáneo) | ⭐⭐⭐⭐⭐ | El mejor. HTML ya listo en el CDN.                                 |
| **SSR**              | ⚡⚡ (Rápido)        | ⭐⭐⭐⭐⭐ | Igual de bueno, pero el servidor tarda unos ms en generar el HTML. |
| **Híbrido**          | ⚡⚡⚡ / ⚡⚡        | ⭐⭐⭐⭐⭐ | Lo mejor de ambos mundos.                                          |
| **SPA (React puro)** | 🐢 (Lento)           | ⭐⭐⭐     | Google tiene que ejecutar JS para ver el contenido.                |

**Conclusión:**

-   Usa **SSG** siempre que puedas (blogs, landings).
-   Usa **SSR** solo cuando sea necesario (usuarios, datos en vivo).
-   Usa **Híbrido** para mezclar ambos.

---

### 🧙‍♂️ Senior Tip: Hybrid es el Rey

No te cases con SSR puro ni SSG puro. Usa `output: 'hybrid'`.
Te da la velocidad de SSG para la Home/Blog y la flexibilidad de SSR para el Dashboard/Login. Es lo mejor de los dos mundos.
Además, en Vercel/Cloudflare, las páginas SSG no consumen tiempo de ejecución (Serverless), lo que te ahorra dinero.
