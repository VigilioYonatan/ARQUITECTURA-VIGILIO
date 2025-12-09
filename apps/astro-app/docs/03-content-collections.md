# 📚 Content Collections

Una forma poderosa de gestionar contenido (como blogs) con validación de tipos.

## 1. Configuración (`src/content/config.ts`)

Definimos las colecciones y su esquema (estructura de datos) usando Zod.

```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()),
    }),
});

export const collections = { blog };
```

## 2. Crear Contenido

Los archivos van en `src/content/blog/`.
Ejemplo (`post-1.md`):

```markdown
---
title: "Mi Post"
pubDate: "2025-01-01"
tags: ["astro"]
---

Contenido en Markdown...
```

# 📚 Content Collections

Una forma poderosa de gestionar contenido (como blogs) con validación de tipos.

## 1. Configuración (`src/content/config.ts`)

Definimos las colecciones y su esquema (estructura de datos) usando Zod.

```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()),
    }),
});

export const collections = { blog };
```

## 2. Crear Contenido

Los archivos van en `src/content/blog/`.
Ejemplo (`post-1.md`):

```markdown
---
title: "Mi Post"
pubDate: "2025-01-01"
tags: ["astro"]
---

Contenido en Markdown...
```

## 3. Usar la Colección

Podemos obtener todas las entradas con `getCollection`.

```typescript
import { getCollection } from "astro:content";
const posts = await getCollection("blog");
```

## 4. Preguntas Frecuentes

### ¿Por qué usar `.md` y no Componentes (`.tsx`)?

-   **Separación de Intereses**: El contenido (texto) vive separado del diseño (código). Si quieres cambiar el diseño de 100 posts, solo editas una plantilla (`[slug].astro`), no 100 archivos.
-   **Portabilidad**: Markdown es universal. React no.
-   **Rendimiento**: Markdown se compila a HTML estático. React suele requerir JavaScript en el cliente.

### ¿Puedo usar Valibot en lugar de Zod?

**No en `defineCollection`**.
Astro usa Zod internamente para generar los tipos de TypeScript. Para la carpeta `src/content`, Zod es obligatorio. Puedes usar Valibot en el resto de tu aplicación.

### ¿Es obligatoria la carpeta `src/content`?

-   **SÍ**, si quieres usar las funciones de "Base de Datos" (validación, consultas, filtrado).
-   **NO**, si solo quieres una página suelta (ej: `src/pages/aviso-legal.md`). Esa se convierte en ruta automática pero no tiene validación.

---

### 🧙‍♂️ Senior Tip: Zod Schemas Reutilizables

No repitas validaciones. Crea `src/schemas/common.ts`:

```typescript
export const imageSchema = z.object({ src: z.string(), alt: z.string() });
```

Y úsalo en todas tus colecciones. Mantén tus tipos DRY (Don't Repeat Yourself).
