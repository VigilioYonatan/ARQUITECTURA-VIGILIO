# Valkey (Redis Open Source)

Este stack despliega **Valkey**, una alternativa 100% compatible con Redis, totalmente Open Source y respaldada por la Linux Foundation.

## 🚀 Despliegue

1.  Configura la contraseña en `.env`.
2.  Despliega el stack:

```bash
docker stack deploy -c docker-compose.yml valkey-stack
```

## 🔌 Conexión desde tus Apps

Tus aplicaciones Node.js (en el mismo Swarm) pueden conectarse usando el nombre del servicio `valkey`.

**URL de Conexión:**
`redis://:tu_password@valkey:6379`

### Ejemplo Node.js (ioredis)

```javascript
import Redis from "ioredis";

const redis = new Redis({
    host: "valkey", // Nombre del servicio en Docker Swarm
    port: 6379,
    password: process.env.REDIS_PASSWORD,
});
```

## 🛠️ Administración

El stack incluye **Redis Commander**, una interfaz web para ver y editar tus claves.
Accede a través de la URL que configures en Traefik (ej. `valkey.tudominio.com`).

## 💾 Persistencia

-   **AOF (Append Only File):** Activado (`--appendonly yes`). Guarda cada operación en disco para máxima seguridad.
-   **Volumen:** Los datos se guardan en el volumen `valkey_data`.
