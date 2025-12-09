# -----------------------------------------------------------
# Base stage
# -----------------------------------------------------------
FROM node:22.16.0-alpine AS base

# Instalar pnpm (versión 10 LTS)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /usr/src/app


# -----------------------------------------------------------
# Dependencies stage
# -----------------------------------------------------------
FROM base AS dependencies

# Copiar lockfile y package.json
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias (incluye dev)
RUN pnpm install --frozen-lockfile


# -----------------------------------------------------------
# Development stage
# -----------------------------------------------------------
FROM base AS development

WORKDIR /usr/src/app

# Copiar fuentes
COPY . .

# Copiar node_modules desde el stage dependencies
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

CMD ["pnpm", "run", "dev:serve"]


# -----------------------------------------------------------
# Build stage
# -----------------------------------------------------------
FROM base AS build

WORKDIR /usr/src/app

# Copiar fuentes
COPY . .

# Copiar node_modules completos (con dev-deps)
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Compilar
RUN pnpm run build:serve && \
    pnpm run build:client && \
    # Eliminar dev-deps
    pnpm prune --prod


# -----------------------------------------------------------
# Production stage
# -----------------------------------------------------------
FROM base AS production

WORKDIR /usr/src/app

# Crear usuario no-root
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -S -h /usr/src/app cearjs

# Directorios con permisos adecuados
RUN mkdir -p logs && \
    chown cearjs:nodejs logs && \
    chmod 755 logs

# Copiar artefactos con ownership correcto
COPY --chown=cearjs:nodejs --from=build /usr/src/app/package.json ./
COPY --chown=cearjs:nodejs --from=build /usr/src/app/pnpm-lock.yaml ./
COPY --chown=cearjs:nodejs --from=build /usr/src/app/node_modules ./node_modules/
COPY --chown=cearjs:nodejs --from=build /usr/src/app/dist ./dist/
COPY --chown=cearjs:nodejs --from=build /usr/src/app/public ./public/
COPY --chown=cearjs:nodejs --from=build /usr/src/app/migrations ./migrations/
COPY --chown=cearjs:nodejs --from=build /usr/src/app/.sequelizerc ./
COPY --chown=cearjs:nodejs --from=build /usr/src/app/src/assets/temp ./src/assets/temp/

USER cearjs

CMD ["pnpm", "run", "start"]