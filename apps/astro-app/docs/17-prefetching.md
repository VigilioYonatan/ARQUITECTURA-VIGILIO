# ⚡ Prefetching: Navegación Instantánea

Astro tiene un sistema inteligente para cargar las páginas **antes** de que el usuario haga clic.
Esto hace que la navegación se sienta instantánea (como una SPA), incluso en sitios estáticos.

## ¿Cómo funciona?

Cuando el usuario pasa el mouse sobre un link (o entra en pantalla), Astro descarga el HTML/JS de esa página en segundo plano.
Al hacer clic, la página ya está lista.

## Estrategias de Prefetch (`data-astro-prefetch`)

Puedes controlar esto link por link usando el atributo `data-astro-prefetch`.

### 1. `hover` (Por defecto)

Carga cuando el mouse pasa por encima.

-   **Uso**: La mayoría de los links.
-   **Código**: `<a href="/blog" data-astro-prefetch>Blog</a>` (o `data-astro-prefetch="hover"`)

-   **Uso**: Links críticos (ej: Login, Checkout).
-   **Código**: `<a href="/login" data-astro-prefetch="load">Login</a>`

## Configuración Global

Si no quieres poner el atributo en cada link, puedes activarlo para **TODOS** los links en `astro.config.mjs`.

```javascript
// astro.config.mjs
export default defineConfig({
    prefetch: {
        prefetchAll: true, // Prefetch automático de todos los links internos
        defaultStrategy: "hover",
    },
});
```

---

### 🧙‍♂️ Senior Tip: Speculation Rules API

Astro usa `<link rel="prefetch">` por defecto, pero los navegadores modernos soportan **Speculation Rules API**, que es aún más eficiente.
Para activarlo experimentalmente en Astro:

```javascript
// astro.config.mjs
experimental: {
  clientPrerender: true, // Usa Speculation Rules si está disponible
}
```

Esto permite pre-renderizar la página completa en un proceso oculto del navegador, haciendo la navegación literalmente instantánea (0ms).
