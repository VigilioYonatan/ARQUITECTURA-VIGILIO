# 🕵️‍♂️ Dashboard Architecture: El Patrón SPA

Tienes toda la razón.
En un Dashboard privado (`/admin`, `/dashboard`):

1.  **SEO**: No importa (Google no entra).
2.  **SSR**: No es crítico (un spinner de carga es aceptable).
3.  **Interactividad**: Es altísima (formularios, gráficas, modales).

## La Mejor Solución: "Astro como Cascarón" (The Shell Pattern)

En lugar de crear 20 archivos `.astro` (`/dashboard/settings.astro`, `/dashboard/profile.astro`...), creas **UNO SOLO** que carga toda tu App de Preact.

### 1. El Archivo "Catch-All"

Crea `src/pages/dashboard/[...all].astro`.
Esto capturará `yoursite.com/dashboard`, `/dashboard/settings`, `/dashboard/user/1`, etc.

```astro
---
import Layout from '../../layouts/Layout.astro';
import DashboardApp from '../../components/dashboard/DashboardApp.jsx';

// Protección básica de servidor (opcional, pero recomendada)
const user = Astro.locals.user;
if (!user) return Astro.redirect('/login');
---

<Layout title="Dashboard">
  <!--
      client:only="preact"
      Le dice a Astro: "Ríndete. Esto es territorio del navegador".
      No hay SSR. No hay hidratación. Es una SPA pura.
  -->
  <DashboardApp client:only="preact" user={user} />
</Layout>
```

### 2. El Router de Cliente (`DashboardApp.jsx`)

Dentro de Preact, usas un router ligero como `wouter` o `react-router`.

```jsx
import { Router, Route, Switch } from "wouter"; // O tu router favorito

export default function DashboardApp({ user }) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main>
                <Router base="/dashboard">
                    <Switch>
                        <Route path="/" component={Home} />
                        <Route path="/settings" component={Settings} />
                        <Route path="/profile" component={Profile} />
                        <Route>404 Not Found</Route>
                    </Switch>
                </Router>
            </main>
        </div>
    );
}
```

## Ventajas de este enfoque

1.  **Full Preact**: Escribes JSX puro el 100% del tiempo.
2.  **Estado Persistente**: Al navegar entre `/settings` y `/profile`, el estado global no se pierde (porque nunca recargas la página real).
3.  **Velocidad de Desarrollo**: Si vienes de React, te sentirás en casa.

## ¿Cuándo NO usarlo?

Si tu dashboard es mayormente de lectura (ej: ver reportes estáticos), Astro normal sigue siendo mejor porque carga más rápido. Pero si es una "App", usa este patrón.

---

### 🧙‍♂️ Senior Tip: Lazy Loading Routes

En tu router de cliente (React/Preact), no importes todos los componentes arriba.
Usa `lazy` y `Suspense` para dividir el código (Code Splitting).

```jsx
const Settings = lazy(() => import("./Settings"));
// ...
<Suspense fallback={<Spinner />}>
    <Route path="/settings" component={Settings} />
</Suspense>;
```

Así el usuario no descarga el código de "Configuración" si solo entra a ver su "Perfil".
