# 🟡 Routing (Enrutamiento)

Astro usa **enrutamiento basado en archivos** en la carpeta `src/pages`.

## 1. Rutas Estáticas

-   `src/pages/index.astro` -> `/`
-   `src/pages/about.astro` -> `/about`
-   `src/pages/contact.astro` -> `/contact`

## 2. Rutas Dinámicas

Usan corchetes `[]` en el nombre del archivo.

-   `src/pages/blog/[slug].astro` -> `/blog/mi-post`, `/blog/otro-post`

Para generar estas rutas estáticamente (SSG), necesitas exportar `getStaticPaths`:

```typescript
export async function getStaticPaths() {
    return [{ params: { slug: "mi-post" } }, { params: { slug: "otro-post" } }];
}
```

---

### 🧙‍♂️ Senior Tip: Rutas Canónicas y Trailing Slashes

En `astro.config.mjs`, configura siempre `site: 'https://tusitio.com'`.
Además, decide tu estrategia de `trailingSlash` ('always' o 'never') y sé consistente.
Esto evita que `/about` y `/about/` sean tratados como páginas diferentes por Google (contenido duplicado).
