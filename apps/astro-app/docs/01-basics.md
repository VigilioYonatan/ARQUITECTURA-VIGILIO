# 🟢 Astro Basics

## 1. Componentes (`.astro`)

Los componentes de Astro tienen dos partes:

1.  **Frontmatter** (entre `---`): JavaScript que se ejecuta en el **servidor** (build time o request time).
2.  **Template** (HTML + Componentes): Lo que se renderiza.

```astro
---
const title = "Hola Mundo";
---
<h1>{title}</h1>
```

## 2. Layouts

Son componentes normales que envuelven a otros. Usan la etiqueta `<slot />` para indicar dónde va el contenido inyectado.

```astro
<!-- src/layouts/Layout.astro -->
<html>
  <body>
    <slot /> <!-- El contenido va aquí -->
  </body>
</html>
```

## 3. Props

Para pasar datos a un componente, definimos una interfaz `Props` en TypeScript.

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<h2>{title}</h2>
```

## 4. CSS Scoped

Los estilos dentro de una etiqueta `<style>` son **locales** por defecto. No afectan a otros componentes.

```astro
<style>
  h1 { color: red; } /* Solo afecta a los h1 de ESTE componente */
</style>

---
### 🧙‍♂️ Senior Tip: VS Code Magic
Instala la extensión oficial de Astro y habilita "Volar" (Vue) si usas Vue, pero desactívala si solo usas React/Preact para evitar conflictos de TS.
Usa `CTRL + SHIFT + P` -> `Astro: Restart Language Server` cuando el autocompletado falle.
```
