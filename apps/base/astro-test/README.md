# Astro-Test API

Full-stack app: **NestJS** + **Astro** + **PostgreSQL** + **Dragonfly**

## 📦 Librerías Principales

| Backend      | Frontend        | Infra             |
| ------------ | --------------- | ----------------- |
| NestJS 11    | Astro 5         | PostgreSQL        |
| Drizzle ORM  | Preact          | Dragonfly (Redis) |
| Passport JWT | TailwindCSS     | MinIO/RustFS      |
| Zod          | React Hook Form | Docker            |

## 🚀 Setup Rápido

```bash
# 1. Instalar
pnpm install

# 2. Configurar
cp .env.example .env

# 3. Levantar servicios
docker compose up -d

# 4. Base de datos
pnpm run db:push
pnpm run db:seed

# 5. Desarrollo
pnpm serve    # Backend :3000
pnpm dev      # Frontend :4321

# 6. Configurar pnpm
pnpm config set store-dir /pnpm/store/v10
pnpm add library
```

## 📚 Documentación

-   [Arquitectura y Prácticas](./docs/ARCHITECTURE.md)
-   [API Reference](/reference) - Swagger/Scalar
-   [Postman Collection](./docs/postman.json)

## 🧞 Comandos

| Comando          | Descripción       |
| ---------------- | ----------------- |
| `pnpm dev`       | Astro dev server  |
| `pnpm serve`     | NestJS dev server |
| `pnpm test`      | Ejecutar tests    |
| `pnpm run biome` | Lint y formato    |

## 📄 Licencia

MIT
