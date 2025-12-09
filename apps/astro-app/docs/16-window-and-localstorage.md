# 🪟 Window, LocalStorage y el Servidor

Esta es la duda #1 de todo desarrollador de Astro.
_"Si Astro corre en el servidor, ¿no puedo usar `window` ni `localStorage`?"_

**Respuesta Corta:** SÍ puedes, pero tienes que proteger el código.

## El Ciclo de Vida

1.  **Servidor (Node.js)**: Astro genera el HTML. Aquí **NO EXISTE** `window` ni `localStorage`. Si intentas usarlos, tu build explota. 💥
2.  **Cliente (Navegador)**: El HTML llega al usuario y se carga el JS. Aquí **SÍ EXISTEN**. ✅

## ¿Cómo usar LocalStorage sin errores?

### 1. En Componentes `.astro` (Scripts)

Los scripts en Astro (`<script>`) **siempre** corren en el navegador. Aquí es seguro.

```html
<!-- SafeComponent.astro -->
<h1>Hola</h1>

<script>
    // Esto SOLO corre en el navegador. Es 100% seguro.
    const theme = localStorage.getItem("theme");
    console.log(window.innerWidth);
</script>
```

### 2. En Frameworks (React/Preact)

El cuerpo del componente corre en el servidor Y en el cliente.
Debes usar `useEffect` (o `componentDidMount`), que **solo corre en el cliente**.

```jsx
import { useState, useEffect } from "preact/hooks";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    // ❌ MAL: Esto explota en el servidor
    // const saved = localStorage.getItem('theme');

    useEffect(() => {
        // ✅ BIEN: useEffect solo corre en el navegador
        const saved = localStorage.getItem("theme");
        if (saved) setTheme(saved);
    }, []);

    return <button>{theme}</button>;
}
```

### 3. La Técnica del `typeof window`

Si necesitas lógica condicional fuera de un hook:

```javascript
if (typeof window !== "undefined") {
    // Seguro: Estamos en el navegador
    localStorage.setItem("foo", "bar");
}
```

### 4. La Opción Nuclear: `client:only`

Si tienes una librería que usa `window` por todas partes y te da pereza arreglarla:

```astro
<!-- Astro se salta el renderizado en servidor.
     El componente solo "nace" en el navegador. -->
<MapComponent client:only="preact" />
```

---

### 🧙‍♂️ Senior Tip: Custom Hooks Seguros

En React, crea un hook `useLocalStorage` que maneje el SSR gracefully.

```typescript
function useLocalStorage(key, initialValue) {
    // Inicializa con el valor por defecto en el servidor para evitar Hydration Mismatch
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        // Solo en el cliente leemos el valor real
        const stored = localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored));
    }, [key]);

    return [value, setValue];
}
```

Esto evita el temido error "Text content does not match server-rendered HTML".
