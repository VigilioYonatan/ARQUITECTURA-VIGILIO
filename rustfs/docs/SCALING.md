# 📈 Scaling RustFS (Arquitectura Distribuida)

Al igual que MinIO, RustFS escala horizontalmente. Su arquitectura "Share-Nothing" permite añadir nodos linealmente.

## 🏗️ Arquitectura de Cluster

### Conceptos Clave

-   **Erasure Coding (EC):** RustFS divide los objetos en fragmentos de datos y paridad.
    -   Ejemplo: Configuración `4+2` (4 datos, 2 paridad). Permite perder 2 discos/nodos sin perder data.
-   **Consistent Hashing:** Distribuye los objetos entre los nodos sin necesidad de un servidor central de metadatos.

### Despliegue Típico (4 Nodos)

```mermaid
graph TD
    LB[Load Balancer (Nginx/HAProxy)] --> Node1[RustFS Node 1]
    LB --> Node2[RustFS Node 2]
    LB --> Node3[RustFS Node 3]
    LB --> Node4[RustFS Node 4]

    Node1 <--> Node2
    Node2 <--> Node3
    Node3 <--> Node4
    Node4 <--> Node1

    subgraph Data Layer
    Node1 --- Disk1[NVMe]
    Node2 --- Disk2[NVMe]
    Node3 --- Disk3[NVMe]
    Node4 --- Disk4[NVMe]
    end
```

## 🐳 Docker Swarm / K8s Setup

Para desplegar un cluster distribuido, necesitas pasar la lista de pares (peers) a cada instancia.

**Ejemplo Conceptual (docker-compose):**

```yaml
services:
    rustfs1:
        image: rustfs/rustfs:latest
        command: server http://rustfs1/data http://rustfs2/data http://rustfs3/data http://rustfs4/data
        deploy:
            placement:
                constraints: [node.labels.zone == a]

    rustfs2:
        image: rustfs/rustfs:latest
        command: server http://rustfs1/data http://rustfs2/data http://rustfs3/data http://rustfs4/data
        deploy:
            placement:
                constraints: [node.labels.zone == b]
    # ... etc
```

> [!NOTE]
> RustFS detecta automáticamente la topología basada en los endpoints proporcionados al inicio.

## 🧪 Escalamiento de Rendimiento

### Small Objects (IA/ML Datasets)

RustFS brilla aquí.

-   **Problema:** Millones de archivos de 4KB (ej. imágenes para entrenamiento).
-   **Ventaja Rust:** El runtime asíncrono maneja millones de IOPS sin el overhead del GC de Go.
-   **Tip Senior:** Usa discos NVMe dedicados para el WAL (Write Ahead Log) si RustFS lo soporta en tu versión, o simplemente NVMe puro para todo.

### Throughput Masivo (Video/Backups)

Para saturar enlaces de 100Gbps:

1.  **Jumbo Frames:** MTU 9000 en la red interna del cluster.
2.  **NIC Bonding:** LACP (802.3ad) para agregar interfaces.
3.  **Cliente:** Usa clientes que soporten `multipart uploads` agresivo (ej. `rclone` con `--transfers 32`).

## 🔄 Migración desde MinIO

RustFS es compatible binariamente con el protocolo S3.
Para migrar sin downtime:

1.  Configura RustFS como **Target** de replicación.
2.  Usa `rclone` o la herramienta de espejo de MinIO (`mc mirror`) para sincronizar.
3.  Cambia el DNS endpoint de tus apps.

```bash
# Ejemplo de migración con mc
mc mirror --watch minio-alias/bucket rustfs-alias/bucket
```

## 🙋 FAQ: ¿Es fácil escalar?

**Respuesta Corta:** Sí, arquitecturalmente es igual de fácil que MinIO.

**Respuesta Senior:**

-   **Infraestructura:** Igual de fácil. Levantas nodos, los apuntas entre sí y listo. No hay "NameNodes" complicados.
-   **Operación:** MinIO gana aquí. MinIO tiene un "Operator" de Kubernetes muy maduro que automágicamente gestiona el cluster. En RustFS, hoy (2026), dependes más de tu configuración manual de StatefulSets o Helm Charts estándar.
-   **Conclusión:** Es fácil de _entender_ y _arquitectar_, pero requiere un poco más de "mano de obra" DevOps para automatizar que MinIO.
