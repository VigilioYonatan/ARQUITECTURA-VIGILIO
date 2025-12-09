# 📦 Nano Stores: Estado Global en Astro

## El Problema: Islas Aisladas 🏝️

En Astro, cada componente interactivo (`client:*`) es una "Isla" independiente.

-   Si tienes un `<Header />` (React) y un `<Product />` (Preact)...
-   **NO pueden hablarse** pasando props, porque viven en árboles de componentes separados.

## La Solución: Nano Stores 🧠

Nano Stores es una librería de estado global (como Redux o Zustand) pero diseñada para ser:

1.  **Agnóstica**: Funciona con React, Preact, Vue, Svelte, Vanilla JS... ¡todo a la vez!
2.  **Diminuta**: Pesa bytes.
3.  **Atómica**: Solo re-renderiza lo que cambia.

## ¿Cómo funciona?

### 1. Creas el "Store" (Almacén)

Es un archivo `.ts` puro. No depende de ningún framework.

```typescript
// src/stores/cart.ts
import { atom } from "nanostores";

export const isCartOpen = atom(false);
export const cartItems = map({}); // Para objetos/arrays
```

### 2. Lo usas en tus Componentes

Nano Stores tiene adaptadores para cada framework.

**En Preact/React:**

```jsx
import { useStore } from "@nanostores/preact";
import { isCartOpen } from "../stores/cart";

export default function CartButton() {
    const $isOpen = useStore(isCartOpen); // El $ es convención
    return <button onClick={() => isCartOpen.set(!$isOpen)}>Carrito</button>;
}
```

**En Vanilla JS (Scripts de Astro):**

```javascript
import { isCartOpen } from "../stores/cart";

isCartOpen.subscribe((open) => {
    console.log("El carrito está:", open);
});
```

## 🚀 Patrones Senior (Nivel Experto)

### 1. Computed Stores (Estado Derivado)

No calcules el total en el componente. Hazlo en el store.
Si `cartItems` cambia, `totalPrice` se recalcula solo.

```typescript
import { computed } from "nanostores";

export const totalPrice = computed(cartItems, (items) => {
    return Object.values(items).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
});
```

### 2. Actions (Lógica Encapsulada)

Nunca hagas `store.set()` directo en el componente. Crea funciones "Action".
Esto hace tu lógica reutilizable y testeable.

```typescript
// ✅ BIEN: Action reutilizable
export function addItem(product) {
  const current = cartItems.get();
  // ... lógica compleja ...
  cartItems.setKey(product.id, newItem);
}

// ❌ MAL: Lógica en el componente
<button onClick={() => cartItems.setKey(id, { ... })} />
```

### 3. Persistencia (LocalStorage)

Guarda el carrito automáticamente en el navegador.

```typescript
import { persistentMap } from "@nanostores/persistent";

// Se guarda en localStorage automáticamente con la key 'cart:'
export const cartItems = persistentMap("cart:", {});
```

### 4. Async Actions (Fetching)

Nano Stores maneja promesas nativamente.

```typescript
export const users = atom([]);

export async function fetchUsers() {
    const res = await fetch("/api/users");
    users.set(await res.json());
}
```

---

### 🧙‍♂️ Senior Tip: Reactividad sin Framework

Nano Stores brilla donde React no llega: **Scripts de Astro**.
Puedes tener un contador global que actualiza el DOM directamente sin cargar React.

```javascript
import { counter } from "../stores/counter";
counter.subscribe((n) => {
    document.getElementById("count").innerText = n;
});
```

Esto es 100x más ligero que hidratar un componente entero solo para mostrar un número.
