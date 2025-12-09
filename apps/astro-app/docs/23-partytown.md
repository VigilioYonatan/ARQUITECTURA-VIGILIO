# 🎉 Partytown: Scripts de Terceros sin Lag

**El Problema:**
Quieres usar Google Analytics, Facebook Pixel, Hotjar, HubSpot...
Pero cada script que añades hace que tu sitio sea más lento. 🐢
¿Por qué? Porque todos pelean por el **Main Thread** (el mismo hilo que usa el navegador para pintar la pantalla y responder a los clics).

**La Solución: Partytown**
Partytown es una librería (mantenida por los creadores de Qwik) que mueve estos scripts pesados a un **Web Worker**.

## ¿Qué es un Web Worker?

Es como un "hilo secundario" o un "background process".

-   **Main Thread**: Se encarga de tu UI (Botones, animaciones, scroll).
-   **Web Worker**: Se encarga de la lógica pesada (Analytics, Tracking).

## ¿Cómo funciona?

Normalmente, el script de Analytics bloquea la UI mientras carga.
Con Partytown, el script corre en el Web Worker. Si se traba, **tu UI sigue fluida**.

## Implementación en Astro

1.  **Instalar**:

    ```bash
    npx astro add partytown
    ```

2.  **Usar**:
    Simplemente añades `type="text/partytown"` a tus scripts.

    ```html
    <!-- Antes (Bloquea el Main Thread) -->
    <script src="https://google-analytics.com/ga.js"></script>

    <!-- Después (Corre en Background) -->
    <script
        type="text/partytown"
        src="https://google-analytics.com/ga.js"
    ></script>
    ```

## ¿Cuándo usarlo?

-   ✅ Google Analytics / GTM
-   ✅ Facebook Pixel
-   ✅ Chat Widgets (Intercom, Zendesk)
-   ❌ Scripts que necesitan manipular el DOM directamente de forma crítica (ej: un slider de imágenes).

**Resultado**: Puedes tener 10 scripts de tracking y seguir teniendo **100/100 en Lighthouse**.

---

### 🧙‍♂️ Senior Tip: CORS y Proxy

Muchos scripts de terceros (como Google Analytics) fallan en Partytown por problemas de CORS.
Para arreglarlo, configura el `forward` en `astro.config.mjs`:

```javascript
partytown({
    config: {
        forward: ["dataLayer.push"], // Reenvía eventos al worker
    },
});
```

Y si el script sigue fallando, usa el proxy reverso de Partytown para servir el JS desde tu propio dominio.
