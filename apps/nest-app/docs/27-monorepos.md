# 🏗️ Monorepos

Gestionar múltiples apps y librerías en un solo repo. NestJS tiene un modo monorepo nativo, pero herramientas como **Nx** o **Turborepo** lo llevan al siguiente nivel.

## 📦 NestJS Monorepo (Nativo)

```bash
nest new project-name
cd project-name
nest generate app admin-panel
nest generate library auth-lib
```

Estructura:

```
apps/
  api/
  admin-panel/
libs/
  auth-lib/
  shared-dto/
```

## 🚀 Nx (Recomendado para Enterprise)

Nx agrega caché de compilación, grafo de dependencias y ejecución paralela inteligente ("Solo testear lo que cambió").

```bash
npx create-nx-workspace@latest
```

Ventajas:

1.  **Código Compartido**: DTOs, validaciones e interfaces compartidas entre Backend (Nest) y Frontend (Angular/React).
2.  **Atomic Commits**: Cambios en API y UI van en el mismo commit.

## 💡 Best Practices

1.  **Librerías pequeñas**: No crees una `SharedLib` gigante. Crea librerías enfocadas: `auth-lib`, `ui-lib`, `date-utils-lib`. Esto mejora el Tree-shaking y la velocidad de caché.
2.  **Strict Boundaries**: Usa reglas de ESLint (`@nx/enforce-module-boundaries`) para prohibir que la "UI" importe cosas de "Base de Datos" directamente.
3.  **Affected**: En CI/CD, usa `nx affected:test` para correr tests SOLO de lo que cambió. Ahorra tiempo brutalmente.
