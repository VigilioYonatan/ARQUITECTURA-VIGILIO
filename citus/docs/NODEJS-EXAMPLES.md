# Citus con Node.js - Ejemplos de Integración

Guía para conectar tu aplicación Node.js a un cluster Citus.

## 📦 Instalación

```bash
npm install pg
```

## 🔌 Configuración del Pool

Citus es 100% compatible con PostgreSQL, por lo que usas el driver estándar `pg`.

```javascript
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: process.env.POSTGRES_HOST || "citus-master", // Nombre del servicio en Swarm o IP del LB
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || "myapp",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD,
    max: 20, // Conexiones máximas
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default pool;
```

## 📝 Ejemplos de Uso

### 1. Insertar en Tabla Distribuida

```javascript
const insertEvent = async (userId, eventType, data) => {
    const query = `
        INSERT INTO events (user_id, event_type, data)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    // Citus enruta automáticamente al worker correcto basado en user_id
    const result = await pool.query(query, [userId, eventType, data]);
    return result.rows[0];
};
```

### 2. Consultar Datos (Paralelismo)

```javascript
const getEventsByUser = async (userId) => {
    const query = `
        SELECT * FROM events
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 100
    `;
    // Esta consulta va directo al worker que tiene los datos del usuario
    const result = await pool.query(query, [userId]);
    return result.rows;
};
```

### 3. Agregaciones Distribuidas (Map-Reduce)

```javascript
const getEventStats = async () => {
    const query = `
        SELECT 
            event_type,
            COUNT(*) as count,
            COUNT(DISTINCT user_id) as unique_users
        FROM events
        GROUP BY event_type
    `;
    // Citus ejecuta esto en paralelo en todos los workers y combina resultados
    const result = await pool.query(query);
    return result.rows;
};
```

## ⚠️ Mejores Prácticas

1.  **Connection Pooling:** Siempre usa un pool (`pg.Pool`). Citus maneja muchas conexiones internas, no quieres saturar el coordinator.
2.  **Shard Key:** Incluye la _shard key_ (ej. `user_id`) en tus `WHERE` siempre que sea posible para evitar "scatter-gather" (consultar a todos los nodos).
3.  **Transacciones:** Las transacciones distribuidas funcionan, pero intenta mantenerlas cortas.
