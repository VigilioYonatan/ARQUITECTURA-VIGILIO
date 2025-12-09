# Configuración Multi-Proyecto en Citus

Esta guía muestra cómo usar un solo cluster Citus para múltiples proyectos/aplicaciones.

## 🎯 Concepto

**Un cluster Citus puede tener múltiples bases de datos:**

```
Cluster Citus (1 Coordinator + 2 Workers)
│
├── app_production      (Proyecto 1)
│   ├── users
│   ├── orders
│   └── products
│
├── app_staging         (Testing)
│   └── (mismas tablas)
│
├── analytics           (Proyecto 2)
│   ├── events
│   └── metrics
│
└── proyecto3           (Proyecto 3)
    └── (tus tablas)
```

## 🚀 Configuración Automática

### Opción 1: Script Automático (Recomendado)

Este script crea automáticamente las bases de datos y usuarios de ejemplo.
**Nota:** Debes ejecutar esto en el **Nodo 1 (Master)** donde corre el contenedor `citus-master`.

```bash
# Navega a la carpeta shared
cd citus/shared
chmod +x setup-multi-projects.sh
./setup-multi-projects.sh
```

**El script crea automáticamente:**

-   ✅ 3 bases de datos (production, staging, analytics)
-   ✅ 3 usuarios (uno por proyecto)
-   ✅ Extensión Citus en cada DB
-   ✅ Permisos configurados
-   ✅ Muestra strings de conexión

### Opción 2: Manual

```sql
-- Conectar al coordinator
docker exec -it citus-master psql -U postgres

-- Crear base de datos
CREATE DATABASE mi_proyecto;

-- Crear usuario
CREATE USER mi_usuario WITH PASSWORD 'MiPassword123!';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE mi_proyecto TO mi_usuario;

-- Conectar a la nueva DB
\c mi_proyecto

-- Crear extensión Citus
CREATE EXTENSION citus;

-- Dar permisos en schema
GRANT ALL ON SCHEMA public TO mi_usuario;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mi_usuario;
```

## 💻 Conexión desde Aplicaciones

### Proyecto 1 - Node.js

```javascript
// config/database.js
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || "citus-master",
    port: process.env.DB_PORT || 5432,
    database: "app_production",
    user: "app_user",
    password: "AppPassword123!",
    max: 20,
    idleTimeoutMillis: 30000,
});

export default pool;
```

### Proyecto 2 - Node.js

```javascript
// config/database.js
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || "citus-master", // Mismo host
    port: process.env.DB_PORT || 5432,
    database: "analytics", // Diferente DB
    user: "analytics_user", // Diferente usuario
    password: "AnalyticsPassword123!",
    max: 20,
});

export default pool;
```

### Variables de Entorno por Proyecto

**Proyecto 1 (.env):**

```bash
DB_HOST=citus-master
DB_PORT=5432
DB_NAME=app_production
DB_USER=app_user
DB_PASSWORD=AppPassword123!
```

**Proyecto 2 (.env):**

```bash
DB_HOST=citus-master
DB_PORT=5432
DB_NAME=analytics
DB_USER=analytics_user
DB_PASSWORD=AnalyticsPassword123!
```

## 📊 Gestión de Recursos

### Ver Uso por Base de Datos

```sql
-- Conectar como postgres
docker exec -it citus-master psql -U postgres

-- Ver tamaño de cada base de datos
SELECT
    datname as "Base de Datos",
    pg_size_pretty(pg_database_size(datname)) as "Tamaño"
FROM pg_database
WHERE datname NOT IN ('postgres', 'template0', 'template1')
ORDER BY pg_database_size(datname) DESC;

-- Ver conexiones activas por DB
SELECT
    datname as "Base de Datos",
    count(*) as "Conexiones"
FROM pg_stat_activity
WHERE datname IS NOT NULL
GROUP BY datname
ORDER BY count(*) DESC;
```

### Ver Tablas Distribuidas por Proyecto

```sql
-- Conectar a una base de datos específica
\c app_production

-- Ver tablas distribuidas
SELECT * FROM citus_tables;

-- Ver distribución de shards
SELECT
    logicalrelid::text as tabla,
    count(*) as shards,
    pg_size_pretty(sum(shard_size)) as tamaño
FROM citus_shards
GROUP BY logicalrelid;
```

## 🔐 Seguridad y Aislamiento

### Usuarios con Permisos Limitados

```sql
-- Usuario solo lectura
CREATE USER readonly_user WITH PASSWORD 'ReadOnly123!';
GRANT CONNECT ON DATABASE app_production TO readonly_user;
\c app_production
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Usuario solo para una tabla
CREATE USER reports_user WITH PASSWORD 'Reports123!';
GRANT CONNECT ON DATABASE app_production TO reports_user;
\c app_production
GRANT SELECT ON users, orders TO reports_user;
```

### Backup por Proyecto

```bash
# Backup de un proyecto específico
docker exec citus-master pg_dump -U postgres app_production > app_production_backup.sql

# Backup de todos los proyectos
docker exec citus-master pg_dumpall -U postgres > all_databases_backup.sql

# Restaurar un proyecto
cat app_production_backup.sql | docker exec -i citus-master psql -U postgres app_production
```

## 💰 Comparación de Costos

### Opción A: 1 Cluster, Múltiples DBs (Recomendado)

```
Costo: $120/mes
Proyectos: Ilimitados
Recursos: Compartidos

Ejemplo:
- app_production: 8GB RAM
- app_staging: 2GB RAM
- analytics: 4GB RAM
- proyecto3: 2GB RAM
Total: 16GB compartidos
```

### Opción B: 1 Cluster por Proyecto

```
Costo: $120/mes × N proyectos
Proyectos: N
Recursos: Dedicados

Ejemplo con 3 proyectos:
- Cluster 1: $120/mes
- Cluster 2: $120/mes
- Cluster 3: $120/mes
Total: $360/mes
```

**Ahorro: $240/mes usando múltiples DBs**

## 🎯 Mejores Prácticas

### 1. Nomenclatura Consistente

```
Producción:  app_production, api_production
Staging:     app_staging, api_staging
Desarrollo:  app_development
Analytics:   analytics, data_warehouse
```

### 2. Usuarios Dedicados

```
Cada proyecto = Su propio usuario
- app_production → app_user
- analytics → analytics_user
- proyecto2 → proyecto2_user
```

### 3. Monitoreo por Proyecto

```sql
-- Crear vista de monitoreo
CREATE VIEW project_stats AS
SELECT
    datname,
    pg_size_pretty(pg_database_size(datname)) as size,
    (SELECT count(*) FROM pg_stat_activity WHERE datname = d.datname) as connections
FROM pg_database d
WHERE datname NOT IN ('postgres', 'template0', 'template1');

-- Consultar
SELECT * FROM project_stats;
```

## 🚨 Cuándo Separar en Clusters Diferentes

**Mantén en 1 cluster si:**

-   ✅ Proyectos pequeños/medianos
-   ✅ Presupuesto limitado
-   ✅ Tráfico moderado
-   ✅ No hay requisitos críticos de aislamiento

**Separa en clusters si:**

-   ❌ Un proyecto es muy crítico
-   ❌ Necesitas aislamiento total de recursos
-   ❌ Diferentes regiones geográficas
-   ❌ Compliance/regulaciones estrictas

## 📝 Ejemplo Completo

```bash
# 1. Desplegar cluster
cd citus
docker stack deploy -c docker-compose.yml citus-stack

# 2. Configurar múltiples proyectos (en Nodo 1)
cd shared
./setup-multi-projects.sh

# 3. Conectar desde app
# (Ver ejemplos de Node.js arriba)

# 4. Crear tablas distribuidas
docker exec -it citus-master psql -U app_user -d app_production
CREATE TABLE users (id BIGSERIAL, name TEXT, email TEXT);
SELECT create_distributed_table('users', 'id');
```

## 🎓 Resumen

-   ✅ **1 cluster Citus = Múltiples proyectos**
-   ✅ **Cada proyecto = Su propia base de datos**
-   ✅ **Usuarios separados por seguridad**
-   ✅ **Recursos compartidos = Ahorro de costos**
-   ✅ **Fácil de escalar agregando workers**

---

**Usa el script `setup-multi-projects.sh` para configurar automáticamente.**
