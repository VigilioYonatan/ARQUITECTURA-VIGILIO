# 🎓 getStaticPaths: Nivel Senior

`getStaticPaths` es el corazón del SSG en Astro. Aquí tienes las prácticas avanzadas que separan a un junior de un senior.

## 1. Paginación Automática (`paginate()`)

Cuando tienes 1,000 posts, no quieres mostrarlos todos en una página. Astro tiene una utilidad mágica para esto.

```typescript
// src/pages/blog/[page].astro
import { getCollection } from "astro:content";

export async function getStaticPaths({ paginate }) {
    const posts = await getCollection("blog");
    // Genera /blog/1, /blog/2, etc. automáticamente
    return paginate(posts, { pageSize: 10 });
}

const { page } = Astro.props;
```

## 2. Generar Rutas por Categoría/Tag

Un patrón común es `/blog/tag/[tag]`. Esto requiere "aplanar" tus datos.

```typescript
// src/pages/blog/tag/[tag].astro
export async function getStaticPaths() {
    const posts = await getCollection("blog");

    // 1. Extraer todos los tags únicos
    const uniqueTags = [...new Set(posts.map((post) => post.data.tags).flat())];

    // 2. Generar una ruta por cada tag
    return uniqueTags.map((tag) => {
        // 3. Filtrar los posts que pertenecen a este tag
        const filteredPosts = posts.filter((post) =>
            post.data.tags.includes(tag)
        );

        return {
            params: { tag },
            props: { posts: filteredPosts }, // Pasamos los posts YA filtrados
        };
    });
}
```

## 3. Performance: "Props Drilling" vs "Fetching Again"

**Best Practice:** Pasa TODOS los datos necesarios en `props`.

-   **✅ BIEN:**

    ```typescript
    return {
        params: { slug: post.slug },
        props: { post }, // Pasamos el objeto completo
    };
    // En el componente: const { post } = Astro.props;
    ```

    _Astro guarda estos datos en el JSON de compilación. No se vuelve a leer el disco._

-   **❌ MAL:**
    ```typescript
    return {
        params: { slug: post.slug },
    };
    // En el componente: await getEntry('blog', slug);
    ```
    _Esto obliga a Astro a buscar en el disco de nuevo para cada página._

## 4. Type Safety (TypeScript)

Usa `InferGetStaticPropsType` para que tus props tengan tipos automáticos.

````typescript
import type { InferGetStaticPropsType, GetStaticPaths } from "astro";

export const getStaticPaths = (async () => {
    // ...
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

    ```

## 5. Arquitectura de URLs: ¿Por qué `/blog/tag/[tag]` y no `/blog/[tag]`?

Podrías pensar: *"¿Por qué no ponerlo directo en `/blog/[tag]` para que la URL sea más corta?"*

**El Problema: Colisiones de Rutas**
Imagina que tienes:
1.  Un post con slug: `astro` (`/blog/astro`)
2.  Un tag llamado: `astro` (`/blog/astro`)

Astro no sabrá cuál renderizar.

**La Solución Senior: Namespacing**
Siempre usa un prefijo para distinguir tipos de contenido:
*   Posts: `/blog/[slug]`
*   Tags: `/blog/tag/[tag]`
*   Categorías: `/blog/category/[cat]`
*   Autores: `/blog/author/[id]`

**Beneficios:**
1.  **Sin conflictos**: Nunca chocarán un post y un tag.
2.  **SEO**: Estructura lógica para Google (`/tag/` indica claramente una agrupación).
3.  **Mantenibilidad**: Es fácil saber qué archivo maneja qué ruta.

---
### 🧙‍♂️ Senior Tip: Debugging getStaticPaths
Si tu build falla con "Astro could not render path...", usa `console.table(paths)` dentro de `getStaticPaths`.
Esto imprimirá una tabla bonita en la terminal con todos los params y props que estás generando, facilitando ver dónde falta un `slug` o un dato.
````
