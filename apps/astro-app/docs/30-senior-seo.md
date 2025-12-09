# 🕵️‍♂️ Senior SEO: Más allá del `<title>`

El SEO "Junior" es poner un título y una descripción.
El SEO "Senior" es **Arquitectura de Información** y **Datos Estructurados**.

Aquí tienes las 5 prácticas que diferencian una web amateur de una profesional en Astro.

## 1. El Componente `<SEO />` Centralizado

No copies y pegues `<meta>` tags en cada página. Crea un componente maestro.

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
}

const { title, description, image = '/default-og.png', article = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const socialImageURL = new URL(image, Astro.site);
---

<!-- Global Metadata -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="generator" content={Astro.generator} />

<!-- Canonical URL (CRÍTICO para evitar contenido duplicado) -->
<link rel="canonical" href={canonicalURL} />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={article ? 'article' : 'website'} />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={socialImageURL} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={socialImageURL} />
```

## 2. JSON-LD (Rich Snippets)

Google ama los datos estructurados. Esto hace que salgas con estrellitas, precios o recetas en el buscador.

```astro
---
// En tu página de producto o blog post
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "image": socialImageURL,
  "author": {
    "@type": "Person",
    "name": "Tu Nombre"
  },
  "datePublished": "2024-01-01"
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## 3. Sitemap & Robots.txt (Automático)

No lo hagas a mano. Usa la integración oficial.

1.  `pnpm add @astrojs/sitemap`
2.  En `astro.config.mjs`:
    `javascript
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://mi-sitio.com', // OBLIGATORIO
  integrations: [sitemap()],
});
`
    Esto genera `sitemap-index.xml` y `sitemap-0.xml` automáticamente al hacer build.

## 4. Hreflang (Internacionalización)

Si usas i18n, DEBES decirle a Google qué versión es cuál.
Astro lo hace casi solo, pero asegúrate de que tu `<head>` incluya:

```html
<link rel="alternate" hreflang="es" href="https://site.com/es/post" />
<link rel="alternate" hreflang="en" href="https://site.com/en/post" />
<link rel="alternate" hreflang="x-default" href="https://site.com/es/post" />
```

## 5. Performance es SEO (Core Web Vitals)

Google penaliza webs lentas. Con Astro ya tienes ventaja, pero ojo con:

-   **CLS (Layout Shift)**: Pon siempre `width` y `height` en tus imágenes (o usa `<Image />` de Astro).
-   **LCP (Largest Contentful Paint)**: La imagen principal (Hero) debe tener `loading="eager"`, las demás `loading="lazy"`.
-   **Fuentes**: Usa `@font-source` o alójala localmente para evitar saltos de fuente.

---

**Tip Pro**: Usa [Partytown](docs/23-partytown.md) para que Google Analytics no arruine tu puntuación de Lighthouse.

## 6. Dynamic OG Images (Satori) - Nivel Experto

¿Has visto esas imágenes de Twitter que cambian según el título del post? No las hacen en Photoshop.
Usan **Satori** (de Vercel) para convertir HTML/CSS a PNG al vuelo.

En Astro, puedes crear un endpoint `.png.ts`:

```typescript
// src/pages/og/[slug].png.ts
import { ImageResponse } from "@vercel/og";

export async function GET({ params }) {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 60,
                    background: "white",
                    width: "100%",
                    height: "100%",
                }}
            >
                <h1>{params.slug}</h1>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
```

## 7. RSS Feeds (Fidelización)

El SEO no es solo Google. RSS permite que Feedly y otros lectores consuman tu contenido.
Astro tiene un helper oficial: `@astrojs/rss`.

```typescript
// src/pages/rss.xml.js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
    const blog = await getCollection("blog");
    return rss({
        title: "Mi Blog",
        description: "Astro Tips",
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            link: `/blog/${post.slug}/`,
        })),
    });
}
```

## 8. Breadcrumbs Schema (Navegación)

Ayuda a Google a entender la estructura de tu sitio (Home > Blog > Post).

```json
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://example.com"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://example.com/blog"
        }
    ]
}
```
