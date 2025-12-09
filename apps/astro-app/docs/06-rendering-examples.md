# 🧪 Ejemplos de Renderizado

Aquí tienes los ejemplos de código para cada modo.

## 1. SSG (Static Site Generation)

Es el default. No necesitas poner nada especial.

```astro
---
// src/pages/about.astro
const fecha = new Date(); // Se ejecuta SOLO en el build
---
<h1>Esta fecha no cambia: {fecha}</h1>
```

## 2. SSR (Server Side Rendering)

Requiere `output: 'server'` en tu config y un adaptador (como `@astrojs/node`).

```astro
---
// src/pages/ssr.astro
// Se ejecuta en CADA visita
const fecha = new Date();
---
<h1>Esta fecha cambia siempre: {fecha}</h1>
```

## 3. Híbrido (Hybrid)

Tienes el sitio en modo SSR, pero quieres que una página específica sea estática.

```astro
---
// src/pages/hybrid.astro
export const prerender = true; // <--- LA CLAVE

const fecha = new Date(); // Se congela en el build
---
<h1>Soy estática en un mundo dinámico: {fecha}</h1>
```

## 4. ISR (Incremental Static Regeneration)

Esto depende del adaptador. Por ejemplo, en **Vercel**:

```astro
---
// src/pages/isr.astro
export const prerender = true;
// Configuración específica del adaptador (varía según la versión)
---
<!-- En Vercel, puedes configurar headers para revalidar -->
<meta http-equiv="Cache-Control" content="max-age=60" />
```

---

## ❓ ¿Es necesario `@astrojs/node` para SSR?

**SÍ, necesitas un "Adaptador".**
Astro por sí solo no sabe cómo hablar con un servidor real. Necesita un traductor.

-   Si usas tu propio servidor (VPS, Docker, Local): Usa **Node.js**.
-   Si usas la nube: Usa **Vercel**, **Netlify**, **Cloudflare**, etc.

Sin adaptador, `npm run build` no sabrá qué archivo de salida generar (¿un `server.mjs`? ¿una función lambda?).

---

## 🆚 Next.js vs Astro: ¿Cómo hago...?

### 1. `revalidate: 60` (ISR)

En Next.js pones una propiedad. En Astro (con adaptador Vercel/Netlify), usas **Headers HTTP**.

```astro
---
// src/pages/isr-page.astro
export const prerender = false; // O true, depende del adaptador

// Esto le dice al CDN: "Guarda esto 60 segundos, luego reconstrúyelo"
Astro.response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30');
---
```

### 2. `fallback: 'blocking'` / Redirect si no existe

En Next.js `getStaticPaths` tiene `fallback`.
En Astro **SSG**, si la ruta no existe, es un 404 automático del servidor.

Si quieres controlar esto (ej: redirigir si no encuentra el producto), necesitas **SSR**:

````astro
---
// src/pages/producto/[id].astro
const { id } = Astro.params;
const producto = await db.getProduct(id);


---

## ❓ ¿ISR sirve para páginas dinámicas?

**Depende de qué entiendas por "dinámico".**

### ✅ SÍ: Rutas Dinámicas (`/producto/[id]`)
Puedes usar ISR para cachear productos individuales.
Si tienes 1 millón de productos, no quieres hacer build de todos.
ISR generará `/producto/123` la primera vez que alguien entre, y lo guardará en caché.

```astro
---
// src/pages/producto/[id].astro
export const prerender = false; // SSR
const { id } = Astro.params;

// Cachear ESTE producto por 60 segundos
Astro.response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

const producto = await db.getProduct(id);
---
<h1>{producto.nombre}</h1>
````

### ❌ NO: Datos de Usuario (`/perfil`, `/carrito`)

**PELIGRO:** Nunca uses ISR para páginas que muestran datos privados.
Si cacheas `/perfil`, **Pepito podría ver los datos de Juan** si el CDN le sirve la copia cacheada.

Para usuarios logueados, usa **SSR Puro** (sin headers de caché).

---

### 🧙‍♂️ Senior Tip: CDN vs Browser Cache

Cuando uses ISR, configura `s-maxage` (para el CDN) alto y `max-age` (para el navegador) bajo.
Ejemplo: `s-maxage=3600, max-age=60`.
Esto permite que Vercel/Cloudflare sirvan la página rápido a todo el mundo, pero si actualizas el contenido, el usuario individual no se queda con una versión vieja en su Chrome por una hora.
