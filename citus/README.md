# Citus Data (PostgreSQL Distribuido) - Guía Swarm

Configuración profesional para desplegar un cluster de **Citus** (PostgreSQL distribuido) usando **Docker Swarm** y **Dokploy**.

## 🏗️ Arquitectura

-   **Coordinator (Master):** Recibe las consultas y las distribuye.
-   **Workers:** Almacenan los datos (shards) y ejecutan las consultas en paralelo.
-   **Manager:** Servicio efímero que conecta automáticamente los workers al master.

## 📋 Requisitos

1.  **3 o más VPS** conectados en Docker Swarm.
2.  **Etiquetas (Labels):** Debes etiquetar tus nodos para fijar los servicios.

## 🛠️ Instalación

### 1. Etiquetar Nodos

En el nodo Manager, asigna las etiquetas a tus servidores:

```bash
# Elige qué VPS será el Master
docker node update --label-add citus-node=1 <HOSTNAME-VPS1>

# Elige qué VPS serán Workers
docker node update --label-add citus-node=2 <HOSTNAME-VPS2>
docker node update --label-add citus-node=3 <HOSTNAME-VPS3>
```

### 2. Configurar Variables

Crea o edita el archivo `.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=TuPasswordSeguro
POSTGRES_DB=postgres
CLOUDBEAVER_PORT=8978
```

### 3. Desplegar Stack

```bash
docker stack deploy -c docker-compose.yml citus-stack
```

## 📈 Cómo Escalar (Agregar Workers)

A diferencia de MinIO, **Citus permite agregar workers de 1 en 1**.

### Paso 1: Agregar Nuevo Nodo

1.  Agrega un nuevo VPS al Swarm (si es necesario).
2.  Etiquétalo:
    ```bash
    docker node update --label-add citus-node=4 <HOSTNAME-VPS4>
    ```

### Paso 2: Actualizar `docker-compose.yml`

Agrega el nuevo servicio `citus-worker3`:

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
```

### Paso 3: Redesplegar

```bash
docker stack deploy -c docker-compose.yml citus-stack
```

### Paso 4: Conectar y Rebalancear

Una vez el nuevo worker esté online, conéctate al Master y agrégalo:

```sql
-- Conectar worker
SELECT * from citus_add_node('citus-worker3', 5432);

-- Rebalancear datos (Mover shards al nuevo nodo)
SELECT rebalance_table_shards();
```

## 🔍 Monitoreo y Gestión

-   **CloudBeaver:** Accede a `http://<IP-CUALQUIER-NODO>:8978` para gestionar la base de datos visualmente.
-   **Dokploy:** Puedes exponer CloudBeaver o el puerto de PostgreSQL a través de Dokploy si es necesario.

## ⚠️ Notas Importantes

-   **Persistencia:** Los volúmenes son locales. Si el VPS 1 muere, el Master muere (y sus datos quedan en el disco del VPS 1).
-   **Backups:** Configura backups periódicos (pg_dump) usando Dokploy o scripts cron.
