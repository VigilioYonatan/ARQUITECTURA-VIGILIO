# 🆚 Astro vs JSX: ¿Cuál uso y cuándo?

Esta es la decisión de arquitectura más importante en Astro.
Tu intuición dice: _"Uso JSX para todo porque ya sé React"_.
**¡ERROR!** 🛑 Esa mentalidad mata el rendimiento de Astro.

## 1. La Regla de Oro 🥇

> **Usa `.astro` por defecto.** > **Usa `.jsx` SOLO cuando necesites interactividad (clicks, estado, hooks).**

## 2. ¿Por qué NO usar JSX para todo?

Imagina un `Card` estático (título, texto, imagen).

-   **Si usas `.astro`**:

    -   Astro renderiza HTML puro en el servidor.
    -   **Envía al navegador**: 0KB de JavaScript.
    -   **Rendimiento**: 🚀 Instantáneo.

-   **Si usas `.jsx` (con `client:load`)**:
    -   El navegador descarga el HTML.
    -   **ADEMÁS descarga**: La librería (React/Preact) + El código del componente.
    -   **ADEMÁS ejecuta**: El proceso de "Hidratación" (CPU).
    -   **Resultado**: Gastas batería y datos del usuario para mostrar algo que NO cambia.

## 3. Guía de Decisión (Cheat Sheet)

| Componente           | ¿Necesita Interacción? | ¿Qué usar? | Directiva        |
| :------------------- | :--------------------- | :--------- | :--------------- |
| **Header / Footer**  | No (solo links)        | `.astro`   | N/A              |
| **Layout**           | No                     | `.astro`   | N/A              |
| **Blog Post**        | No (texto)             | `.astro`   | N/A              |
| **Card de Producto** | No (imagen/precio)     | `.astro`   | N/A              |
| **Botón "Comprar"**  | **SÍ** (onClick)       | `.jsx`     | `client:idle`    |
| **Menú Móvil**       | **SÍ** (abrir/cerrar)  | `.jsx`     | `client:media`   |
| **Carrusel**         | **SÍ** (slide)         | `.jsx`     | `client:visible` |
| **Buscador**         | **SÍ** (input)         | `.jsx`     | `client:load`    |

## 4. El Patrón "Islas" (Mix & Match)

Lo hermoso es que puedes mezclar.
Puedes tener una `Card.astro` (estática) que adentro tiene un `LikeButton.jsx` (interactivo).

```astro
<!-- Card.astro (0KB JS) -->
<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>

  <!-- Solo este pedacito carga JS -->
  <LikeButton client:idle id={id} />
</div>
```

**Conclusión:**
Si es estático, `.astro` gana siempre.
Si se mueve o cambia en el cliente, `.jsx` es obligatorio.

---

### 🧙‍♂️ Senior Tip: ¿Y si uso Vanilla JS?

A veces cargar React (40KB) para un simple "Toggle Menu" es matar moscas a cañonazos.
Usa `<script>` tags dentro de tus componentes `.astro` para lógica simple.

```astro
<button id="menu">Menu</button>
<script>
  // Esto corre en el cliente y pesa 0KB extra
  document.getElementById('menu').addEventListener('click', () => ...);
</script>
```

Es la opción más performante de todas.
