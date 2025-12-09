# 🚀 CI/CD Pipeline

Automatizar el despliegue es el último paso del maestro.

## 🧪 Pipeline Típico (GitHub Actions)

1.  **Checkout**: Bajar el código.
2.  **Install**: `npm ci` (Instalación limpia).
3.  **Lint & Format**: Verificar estilo (`npm run lint`).
4.  **Test Unitarios**: `npm run test` (Si falla, no despliega).
5.  **Test E2E**: `npm run test:e2e` (Prueba la app levantada).
6.  **Build**: `npm run build` (Compilar TS a JS).
7.  **Docker Build**: Crear imagen `my-app:latest`.
8.  **Deploy**: Push a AWS ECR / Deploy a Kubernetes / Railway / Render.

## 💡 Estrategias de Deploy

- **Rolling Update** (Kubernetes Default): Reemplaza pods viejos por nuevos poco a poco. No hay downtime.
- **Blue/Green**: Levantas la versión Nueva (Green) al lado de la Vieja (Blue). Cuando Green está sana, cambias el balanceador de carga. Rollback instantáneo si falla.

## 📄 Dockerfile Optimizado (Multi-stage)

```dockerfile
# 1. Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Production Stage (Imagen ligera)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]
```

## 💡 Best Practices

1.  **Cache Dependencies**: Cachea `node_modules` en tu CI para no bajar 500MB en cada commit.
2.  **Immutable Images**: Usa tags con SHA (`myapp:a1b2c3d`) en lugar de `myapp:latest`. Así sabes exactamente qué código corre en producción.
3.  **GitOps (ArgoCD)**: En lugar de hacer `kubectl apply` desde el CI, haz commit del cambio de versión en un repo `infra-config` y deja que ArgoCD sincronice el cluster K8s. Es más seguro y auditable.
