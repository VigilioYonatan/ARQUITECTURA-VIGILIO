# 🚀 View Transitions (ClientRouter)

Convierte tu sitio estático en una experiencia tipo SPA (Single Page Application) sin recargas completas.

## 1. Implementación

En Astro 5, usamos el componente `<ClientRouter />`.

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

## 2. ¿Afecta al SEO?

**NO**.

-   Astro sigue enviando HTML completo al navegador en la carga inicial.
-   Los crawlers (Googlebot) ven el contenido perfectamente.
-   El router solo actúa en la navegación subsiguiente (lado cliente).

## 3. Consideraciones

-   **Scripts**: Si tienes scripts que deben correr en cada página, usa el evento `astro:page-load`.
    ```javascript
    document.addEventListener("astro:page-load", () => {
        console.log("Nueva página cargada");
    });
    ```

---

### 🧙‍♂️ Senior Tip: Persistencia de Estado

View Transitions reinicia el estado de los componentes UI al navegar.
Si tienes un Sidebar con scroll, usa `transition:persist` en el elemento contenedor para que no pierda su posición.
Para elementos complejos (como un reproductor de video), usa `transition:persist="player"` para mantenerlo vivo entre páginas.
