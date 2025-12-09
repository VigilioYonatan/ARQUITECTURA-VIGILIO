# 🧙‍♂️ Nivel Dios: Conceptos de Arquitecto

Ya sabes usar Astro. Ahora vamos a ver cómo **extender** Astro y optimizarlo al milímetro.

## 1. Custom Integrations (El "Final Boss")

¿Te has preguntado cómo funciona `@astrojs/tailwind` o `@astrojs/react`? Son **Integraciones**.
Tú puedes crear las tuyas para:

-   Inyectar scripts de analíticas automáticamente en todas las páginas.
-   Generar un `sitemap.xml` o `robots.txt` dinámico al construir.
-   Modificar la configuración de Vite sin tocar `astro.config.mjs`.

### Estructura Básica

```typescript
// my-integration.ts
import type { AstroIntegration } from "astro";

export default function myIntegration(): AstroIntegration {
    return {
        name: "mi-integracion-secreta",
        hooks: {
            "astro:config:setup": ({ injectScript }) => {
                injectScript(
                    "page",
                    'console.log("¡Hola desde la integración!");'
                );
            },
            "astro:build:done": () => {
                console.log(
                    "¡Build completado! Enviando notificación a Slack..."
                );
            },
        },
    };
}
```

## 2. Server Islands (`server:defer`)

Esto es **nuevo en Astro 4/5**.
Imagina que tienes un componente `<UserRecommendations />` que tarda 3 segundos en cargar porque consulta una IA.

-   **Antes (SSR)**: Toda la página esperaba 3 segundos. (Lento TTFB).
-   **Antes (Client)**: Cargabas un spinner y luego hacías fetch en el cliente. (Layout Shift).
-   **Ahora (Server Islands)**:

```astro
---
import UserRecommendations from '../components/UserRecommendations.astro';
---
<UserRecommendations server:defer>
  <div slot="fallback">Cargando recomendaciones...</div>
</UserRecommendations>
```

**Magia**:

1.  Astro envía el HTML de la página **inmediatamente** (con el fallback).
2.  En segundo plano, renderiza el componente en el servidor.
3.  Cuando termina, inyecta el HTML real en el hueco.
    **Resultado**: Carga instantánea + Contenido dinámico pesado.

## 3. Content Layer API (Astro 5.0)

Si `Content Collections` se te queda corto (porque tienes 10,000 posts en una API externa), usas **Content Layer**.
Permite cargar contenido de bases de datos SQL, Notion o CMS headless y tratarlo como si fueran archivos Markdown locales (con validación Zod).

---

### ¿Te falta algo?

Si dominas esto, ya no eres Senior. Eres **Staff Engineer** en Astro.

---

### 🧙‍♂️ Architect Tip: Monorepo Scale

Cuando tu proyecto Astro crezca, no lo hagas gigante.
Usa **Nx** o **Turborepo**.
Mueve tus componentes de UI (`Card.astro`, `Button.jsx`) a una librería compartida (`packages/ui`).
Astro soporta importar componentes desde paquetes externos sin problemas.
Esto te permite tener múltiples apps Astro (Marketing, Docs, Dashboard) consumiendo el mismo Design System.
