# Gestión de Múltiples Proyectos con CloudBeaver

CloudBeaver te permite gestionar todas tus bases de datos desde una interfaz web moderna.

## 🚀 Iniciar CloudBeaver

CloudBeaver se inicia automáticamente cuando despliegas el stack de Citus en Swarm.

```bash
# Verificar que el servicio está corriendo
docker service ps citus-stack_cloudbeaver
```

**Acceso:** `http://<IP-CUALQUIER-NODO>:8978`

## 🔧 Configuración Inicial

### Primera Vez

1. **Abrir CloudBeaver:** http://localhost:8978
2. **Crear usuario admin** (primera vez)
    - Username: admin
    - Password: (tu elección)

### Agregar Conexiones a tus Proyectos

#### Proyecto 1 - Producción

1. Click en **"New Connection"**
2. Seleccionar **PostgreSQL**
3. Configurar:
    ```
    Host: citus-master
    Port: 5432
    Database: app_production
    Username: app_user
    Password: AppPassword123!
    Connection name: Producción
    ```
4. **Test Connection** → **Create**

#### Proyecto 2 - Staging

1. **New Connection** → **PostgreSQL**
2. Configurar:
    ```
    Host: citus-master
    Port: 5432
    Database: app_staging
    Username: staging_user
    Password: StagingPassword123!
    Connection name: Staging
    ```

#### Proyecto 3 - Analytics

1. **New Connection** → **PostgreSQL**
2. Configurar:
    ```
    Host: citus-master
    Port: 5432
    Database: analytics
    Username: analytics_user
    Password: AnalyticsPassword123!
    Connection name: Analytics
    ```

## 📊 Uso de CloudBeaver

### Ver Todas las Bases de Datos

En el panel izquierdo verás:

```
📁 Connections
  ├── 🔵 Producción (app_production)
  ├── 🟡 Staging (app_staging)
  └── 🟢 Analytics (analytics)
```

### Ejecutar Queries

1. Click en una conexión (ej: Producción)
2. Click en **SQL Editor**
3. Escribir query:

    ```sql
    -- Ver tablas distribuidas
    SELECT * FROM citus_tables;

    -- Ver datos
    SELECT * FROM users LIMIT 10;
    ```

4. Click en **Execute** (▶️)

### Crear Tablas Distribuidas

```sql
-- En Producción
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Distribuir tabla
SELECT create_distributed_table('users', 'id');

-- Insertar datos
INSERT INTO users (name, email)
VALUES ('Juan', 'juan@example.com');
```

### Ver Distribución de Shards

```sql
-- Ver cómo se distribuyen los datos
SELECT
    logicalrelid::text as tabla,
    count(*) as shards,
    pg_size_pretty(sum(shard_size)) as tamaño
FROM citus_shards
GROUP BY logicalrelid;
```

### Cambiar Entre Proyectos

-   Click en el nombre de la conexión en el panel izquierdo
-   Cada proyecto tiene sus propias tablas y datos
-   Puedes tener múltiples SQL Editors abiertos

## 🎯 Características Útiles

### 1. Explorador de Datos

-   Click en una tabla → **View Data**
-   Filtrar, ordenar, exportar
-   Editar datos directamente

### 2. Diagrama ER

-   Click derecho en database → **ER Diagram**
-   Ver relaciones entre tablas
-   Exportar como imagen

### 3. Exportar/Importar

-   Click derecho en tabla → **Export Data**
-   Formatos: CSV, JSON, SQL
-   Importar desde archivos

### 4. Múltiples Tabs

-   Abrir varios SQL Editors
-   Trabajar en múltiples proyectos simultáneamente
-   Guardar queries favoritas

## 💡 Tips y Trucos

### Queries Útiles por Proyecto

**Ver tamaño de base de datos:**

```sql
SELECT pg_size_pretty(pg_database_size(current_database()));
```

**Ver workers activos:**

```sql
SELECT * FROM citus_get_active_worker_nodes();
```

**Ver conexiones activas:**

```sql
SELECT
    datname,
    usename,
    application_name,
    client_addr,
    state
FROM pg_stat_activity
WHERE datname = current_database();
```

**Ver tablas más grandes:**

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Guardar Queries Favoritas

1. Escribir query
2. Click en **Save** (💾)
3. Dar nombre (ej: "Ver usuarios activos")
4. Acceder desde **Saved Scripts**

### Temas y Personalización

-   **Settings** → **Appearance**
-   Dark mode / Light mode
-   Tamaño de fuente
-   Layout personalizado

## 🔐 Seguridad

### Conexiones Seguras

CloudBeaver guarda las credenciales de forma segura:

-   Encriptadas en la base de datos interna
-   No se exponen en la UI
-   Sesiones con timeout automático

### Usuarios de Solo Lectura

Crear usuario readonly en PostgreSQL:

```sql
CREATE USER readonly WITH PASSWORD 'ReadOnly123!';
GRANT CONNECT ON DATABASE app_production TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

Luego agregar conexión en CloudBeaver con este usuario.

## 📱 Acceso Remoto

Si quieres acceder desde fuera del servidor:

```yaml
# En docker-compose.yml
cloudbeaver:
    ports:
        - "0.0.0.0:8978:8978" # Exponer a internet
```

**⚠️ Importante:** Usa HTTPS y autenticación fuerte en producción.

## 🎓 Resumen

**CloudBeaver te permite:**

-   ✅ Ver todas tus bases de datos en un solo lugar
-   ✅ Ejecutar queries en múltiples proyectos
-   ✅ Gestionar tablas visualmente
-   ✅ Exportar/importar datos
-   ✅ Ver estadísticas y monitoreo
-   ✅ Diagrama ER de tus tablas

**Acceso:**

-   URL: http://localhost:8978
-   Múltiples conexiones (una por proyecto)
-   Interfaz moderna y rápida

---

**CloudBeaver ya está incluido en tu stack de Swarm.**
