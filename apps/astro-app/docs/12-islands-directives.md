# 🏝️ Astro Islands (Arquitectura de Islas)

El secreto de la velocidad de Astro.
Por defecto, Astro envía **0KB de JavaScript** al navegador. Todo es HTML estático.

Si quieres interactividad (React, Preact, Vue, Svelte), debes "hidratar" componentes específicos. A esto se le llama **Islas**.

## Directivas de Hidratación (`client:*`)

Tú controlas **CUÁNDO** carga el JavaScript de cada componente.

### 1. `client:load` (Inmediato)

-   **Comportamiento**: Hidrata el componente apenas carga la página.
-   **Uso**: Menús de navegación, elementos críticos que deben funcionar ya.
-   **Peso**: Alto (bloquea el TTI si es muy pesado).

### 2. `client:idle` (Cuando se pueda)

-   **Comportamiento**: Espera a que el navegador termine de cargar todo lo importante, y luego hidrata.
-   **Uso**: Chats de soporte, elementos no urgentes.
-   **Peso**: Medio (no bloquea la carga inicial).

### 3. `client:visible` (Al hacer scroll)

-   **Comportamiento**: Solo carga el JS cuando el usuario hace scroll y el componente entra en pantalla.
-   **Uso**: Carruseles, comentarios, galerías al final de la página.
-   **Peso**: **Bajo** (Si el usuario no baja, nunca se carga).

### 4. `client:media="(max-width: 768px)"` (Condicional)

-   **Comportamiento**: Solo hidrata si se cumple la Media Query CSS.
-   **Uso**: Un menú hamburguesa que solo existe en móvil. En desktop es solo HTML.

### 5. `client:only="preact"` (Sin SSR)

-   **Comportamiento**: Se salta el renderizado en servidor. Renderiza SOLO en el navegador.
-   **Uso**: Componentes que necesitan `window` o `localStorage` inmediatamente.
-   **Desventaja**: Malo para SEO (Google ve vacío).

---

## Ejemplo

```astro
<Header client:load />            <!-- Crítico -->
<Sidebar client:idle />           <!-- Secundario -->
<Carousel client:visible />       <!-- Pesado, abajo -->
<MobileMenu client:media="(max-width: 50em)" /> <!-- Solo móvil -->
```

## 🆚 Resumen: ¿Quién tiene SSR?

| Directiva           | ¿Tiene SSR? (HTML Server) | ¿Cuándo carga JS?                |
| :------------------ | :-----------------------: | :------------------------------- |
| **(Sin directiva)** |         ✅ **SÍ**         | ❌ Nunca (0KB JS)                |
| `client:load`       |         ✅ **SÍ**         | Inmediatamente                   |
| `client:idle`       |         ✅ **SÍ**         | Cuando no hay nada que hacer     |
| `client:visible`    |         ✅ **SÍ**         | Al hacer scroll                  |
| `client:media`      |         ✅ **SÍ**         | Si cumple la condición CSS       |
| `client:only`       |         ❌ **NO**         | Inmediatamente (Todo en Cliente) |

> **Nota**: `client:only` es el único que **NO** renderiza nada en el servidor.
> Es obligatorio si usas librerías que fallan en Node.js (ej: que usan `window` o `document` en el cuerpo del componente).

---

### 🧙‍♂️ Senior Tip: Skeleton Loading con `client:only`

Como `client:only` no renderiza nada en el servidor, el usuario ve un espacio en blanco hasta que carga el JS (CLS).
Usa `slot="fallback"` para mostrar un esqueleto mientras tanto:

```astro
<ReactComponent client:only="react">
  <div slot="fallback" class="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
</ReactComponent>
```

Esto mejora la percepción de velocidad y evita saltos de diseño.
