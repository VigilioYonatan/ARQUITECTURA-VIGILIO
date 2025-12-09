# 🖼️ Imágenes en Astro: Nivel Senior (`astro:assets`)

Las imágenes son el factor #1 de lentitud en la web. Astro lo soluciona nativamente.

## 1. ¿Dónde pongo mis imágenes?

Esta es la primera decisión de arquitectura.

-   **`src/assets/` (RECOMENDADO)**:

    -   Astro las procesa, optimiza, comprime y convierte a WebP/AVIF.
    -   Detecta el tamaño automáticamente (evita CLS).
    -   **Uso:** Importándolas en JS/Astro.

-   **`public/` (SOLO SI ES NECESARIO)**:
    -   Astro **NO** las toca. Se sirven tal cual.
    -   **Uso:** `favicon.ico`, `robots.txt`, o imágenes que no conoces en tiempo de build (CMS externo sin integración).

## 2. El Componente `<Image />`

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/hero.jpg'; // Importación directa
---

<!--
  Astro genera automáticamente:
  - width/height (Adiós CLS)
  - loading="lazy"
  - decoding="async"
  - src optimizado (webp)
-->
<Image
  src={myImage}
  alt="Descripción para SEO (OBLIGATORIA)"
  width={800} // Opcional si es local, obligatorio si es remota
/>
```

## 3. SEO y Performance (Nivel Senior)

### 🚫 CLS (Cumulative Layout Shift)

Google penaliza si tu web "salta" cuando carga una imagen.

-   **Solución Astro**: Al importar desde `src/assets`, Astro calcula las dimensiones y las pone en el HTML. El navegador reserva el espacio antes de cargar la imagen.

### 🎨 Formatos Modernos

No uses JPG/PNG.

-   **Solución Astro**: `<Image />` convierte automáticamente a **WebP**.

### 📱 Art Direction (`<Picture />`)

A veces quieres una imagen cuadrada en móvil y panorámica en desktop.
Usa `<Picture />` para generar etiquetas `<source>` múltiples.

```astro
import { Picture } from 'astro:assets';

<Picture
  src={myImage}
  formats={['avif', 'webp']}
  widths={[240, 540, 720, myImage.width]}
  sizes={`(max-width: 360px) 240px, (max-width: 720px) 540px, (max-width: 1600px) 720px, ${myImage.width}px`}
  alt="Imagen responsiva avanzada"
/>
```

## 4. Imágenes Remotas (CMS / AWS S3)

Si la imagen viene de una URL (`https://...`), Astro no puede saber su tamaño.

1.  Debes pasar `width` y `height` manualmente.
2.  Debes autorizar el dominio en `astro.config.mjs` para que Astro pueda optimizarla.

```js
// astro.config.mjs
export default defineConfig({
    image: {
        domains: ["mis-imagenes.com"],
    },
});
```

## 5. Truco Pro: `getImage()`

¿Necesitas la URL optimizada para usarla en un `background-image` de CSS o en una librería de JS?
El componente `<Image />` no sirve ahí porque genera una etiqueta `<img>`.

Usa la función `getImage()`:

```astro
---
import { getImage } from 'astro:assets';
import bgImage from '../assets/bg.jpg';

const optimizedBg = await getImage({src: bgImage, format: 'webp'});
---

<div style={`background-image: url(${optimizedBg.src});`}>
  Texto con fondo optimizado
</div>
```

---

### 🧙‍♂️ Senior Tip: LCP y `loading="eager"`

Por defecto, Astro pone `loading="lazy"` a todo.
**¡Error!** La imagen más grande visible al cargar (LCP - Largest Contentful Paint) debe tener `loading="eager"`.
Si no lo haces, el navegador esperará a parsear el JS/CSS para empezar a descargarla, dañando tu puntuación de Lighthouse.
Regla de oro: La primera imagen del viewport siempre es `eager`.
