# 🎨 Tailwind CSS v4 en Astro

Has instalado la **última versión (v4)**. Esto es "Bleeding Edge".
Aquí tienes lo que un Senior debe saber sobre esta nueva arquitectura.

## 1. Zero Config (Adiós `tailwind.config.js`)

En v4, la configuración vive en el CSS.
Ya no necesitas un archivo de configuración gigante.

**Antes (v3):**

```js
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                neon: "#ccff00",
            },
        },
    },
};
```

**Ahora (v4):**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
    --color-neon: #ccff00;
}
```

## 2. Performance (Lightning CSS)

Astro usa Vite, y Tailwind v4 es un plugin de Vite (`@tailwindcss/vite`).
Esto significa que es **instantáneo**. No hay paso de generación separado.

## 3. Buenas Prácticas

-   **Usa `@apply` con moderación**: Es mejor usar clases en el HTML. `@apply` rompe la ventaja de tener CSS atómico.
-   **Ordena tus clases**: Usa la extensión "Tailwind CSS IntelliSense" para que te ordene las clases automáticamente.
-   **Arbitrary Values**: En v4 son ciudadanos de primera clase.
    -   `bg-[#123456]`
    -   `grid-cols-[1fr_500px_1fr]`

## 4. Integración en Astro

Simplemente importa tu CSS en el Layout principal:

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';
---
```

---

### 🧙‍♂️ Senior Tip: Evita `@apply`

Muchos devs usan `@apply` para "limpiar" el HTML.
**No lo hagas.**
Esto genera CSS extra y rompe la ventaja de cacheo de clases atómicas.
Usa componentes (`<Card />`) para encapsular estilos repetitivos, no `@apply`.
Solo usa `@apply` para estilos de librerías de terceros que no puedes tocar.
