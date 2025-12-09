# Desarrollo Local con Valkey

Es una **mala práctica** usar memoria RAM en desarrollo y Redis en producción. Debes usar Valkey/Redis en ambos entornos para evitar bugs de serialización.

## 🐳 Configuración Local (Docker Compose)

Agrega el servicio `valkey` a tu `docker-compose.dev.yml`:

```yaml
version: "3.8"
services:
    # Tu API (Node.js)
    api:
        build: .
        environment:
            - REDIS_HOST=valkey
            - REDIS_PORT=6379
            # Tip: Desactiva caché en desarrollo si te molesta
            - CACHE_ENABLED=false
        depends_on:
            - valkey

    # Valkey Local
    valkey:
        image: valkey/valkey:7.2
        ports:
            - "6379:6379" # Para conectar herramientas visuales desde tu PC
```

## 💻 Conexión en Código

```javascript
import Redis from "ioredis";

const redis = new Redis({
    // Si corres Node en Docker -> 'valkey'
    // Si corres Node en tu PC -> 'localhost'
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
});
```

## 🧹 Limpiar Caché (Flush)

Si estás programando y los datos viejos en caché te molestan, límpialos al instante:

### Opción 1: Desde la terminal

```bash
# Borra TODO el caché
docker exec -it valkey-container-name valkey-cli FLUSHALL
```

### Opción 2: Script en package.json

Agrega esto a tu `package.json` para hacerlo rápido:

```json
"scripts": {
  "cache:clean": "docker exec -it valkey-dev valkey-cli FLUSHALL"
}
```

Y ejecutas: `npm run cache:clean`

## 💡 Tips para Desarrollo

1.  **TTL Corto:** En desarrollo, usa tiempos de expiración cortos (ej. 5 segundos) para no ver datos viejos.
2.  **Prefijos:** Usa claves como `dev:user:1` para identificar datos de prueba.
3.  **Redis Commander:** Puedes levantar también `redis-commander` en local para ver qué hay en tu caché visualmente.
