# Guía de Escalamiento Horizontal - Citus en Docker Swarm

Esta guía te muestra cómo escalar tu cluster de Citus usando Docker Swarm.

## 🎯 Estrategia de Escalamiento

### Fase 1: Inicio (3 Nodos)

**Configuración:** `citus/docker-compose.yml` (Swarm Stack)
**Infraestructura:** 3 VPS (1 Master + 2 Workers)
**Costo:** ~$120/mes

```bash
docker stack deploy -c docker-compose.yml citus-stack
```

### Fase 2: Expansión (Agregar Workers)

**Cuándo:**

-   CPU > 70% en workers existentes
-   Disco > 80% lleno
-   Consultas lentas

**Acción:** Agregar nuevos VPS de 1 en 1.

## 🚀 Cómo Agregar un Nuevo Worker (Paso a Paso)

### 1. Preparar Nuevo VPS

Compra un nuevo VPS y únelo al Swarm:

```bash
docker swarm join ...
```

### 2. Etiquetar Nodo

Asigna la siguiente etiqueta disponible (ej. si tienes hasta nodo 3, este será el 4):

```bash
docker node update --label-add citus-node=4 <HOSTNAME-VPS4>
```

### 3. Actualizar Stack

Edita `docker-compose.yml` y agrega el nuevo servicio:

```yaml
  citus-worker3:
    <<: *citus-common
    hostname: citus-worker3
    volumes:
      - citus_worker3_data:/var/lib/postgresql/data
    deploy:
      placement:
        constraints:
          - node.labels.citus-node == 4
      resources:
        limits:
          cpus: "2"
          memory: 4G
```

### 4. Redesplegar

```bash
docker stack deploy -c docker-compose.yml citus-stack
```

### 5. Conectar y Rebalancear

Una vez el contenedor esté arriba, ejecuta en el Master:

```bash
# Entrar al Master
docker exec -it $(docker ps -q -f name=citus-master) psql -U postgres

# SQL: Agregar nodo
SELECT * from citus_add_node('citus-worker3', 5432);

# SQL: Rebalancear datos (CRUCIAL)
SELECT rebalance_table_shards();
```

## 💾 Backups y Restauración

El stack incluye un sistema de **backup automático** que sube los datos a MinIO todos los días.

👉 **[Ver Guía Completa de Backups (BACKUPS.md)](BACKUPS.md)**

## 📊 Monitoreo de Shards

Para ver cómo están distribuidos tus datos:

```sql
SELECT
    nodename,
    count(*) as shard_count,
    pg_size_pretty(sum(shard_size)) as total_size
FROM citus_shards
GROUP BY nodename;
```
