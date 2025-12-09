# --- Base Stage ---
FROM node:24.11-alpine AS base
# 1. Actualizar el sistema operativo base para parchar vulnerabilidades conocidas (CVEs)
# 2. Instalar dumb-init para manejar correctamente las señales del sistema (PID 1)
RUN apk update && apk upgrade --no-cache && apk add --no-cache dumb-init
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- Dependencies Stage ---

FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
# Configurar el store en una ruta global, NO en la carpeta del proyecto
RUN pnpm config set store-dir /pnpm/store
RUN pnpm install --frozen-lockfile



# --- Build Stage ---

FROM base AS build
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
# Generar cliente de Prisma
# RUN npx prisma generate
RUN pnpm build
# Eliminar dependencias de desarrollo para reducir el tamaño y superficie de ataque
RUN pnpm prune --prod


# --- Development Stage ---

FROM base AS development
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
CMD [ "pnpm", "serve" ]



# --- Deploy Stage (Production) ---

FROM base AS deploy
WORKDIR /usr/src/app
# 3. Copiar solo lo necesario desde el build stage
# Usamos --chown=node:node para asegurar que el usuario sin privilegios sea dueño de los archivos
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# Si tienes una carpeta de prisma o .env, considera si debes copiarlas aquí también
# COPY --chown=node:node --from=build /app/prisma ./prisma
# 5. Cambiar al usuario "node" (usuario sin privilegios que viene en la imagen oficial)
# ESTO ES CRÍTICO: Nunca correr como root en producción
USER node
# 6. Usar dumb-init como entrypoint para evitar procesos zombie y manejo correcto de señales
CMD [ "dumb-init", "node", "dist/main.js" ]