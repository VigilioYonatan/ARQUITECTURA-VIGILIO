# --- Base Stage ---
FROM node:24.11-alpine AS base
# 1. Actualizar sistema y 2. Instalar dumb-init
RUN apk update && apk upgrade --no-cache && apk add --no-cache dumb-init

# Ya no necesitamos activar corepack ni variables de PNPM
# NPM viene instalado por defecto en la imagen de Node



# --- Dependencies Stage ---
FROM base AS dependencies
WORKDIR /usr/src/app
# IMPORTANTE: Copiamos package-lock.json en lugar de pnpm-lock.yaml
COPY package.json package-lock.json ./

# Usamos 'npm ci' (Clean Install). Es más rápido y estricto para Docker que 'npm install'
RUN npm ci



# --- Build Stage ---
FROM base AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma
# RUN npx prisma generate

# Construir el proyecto
RUN npm run build

# Eliminar dependencias de desarrollo (limpieza)
# --omit=dev es el estándar moderno, pero --production sigue funcionando
RUN npm prune --production



# --- Development Stage ---
FROM base AS development
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
# Asumo que tu script en package.json se llama "serve" o "dev"
CMD [ "npm", "run", "serve" ]



# --- Deploy Stage (Production) ---
FROM base AS deploy
WORKDIR /usr/src/app

# 3. Copiar lo necesario
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# COPY --chown=node:node --from=build /app/prisma ./prisma 

# 5. Cambiar a usuario sin privilegios
USER node

# 6. Entrypoint
CMD [ "dumb-init", "node", "dist/main.js" ]