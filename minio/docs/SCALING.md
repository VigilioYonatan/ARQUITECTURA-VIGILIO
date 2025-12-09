# MinIO - Escalamiento con Docker Swarm

Guía para escalar tu cluster de MinIO en Docker Swarm.

## 🎯 Arquitectura Base (4 Nodos)

Esta es la configuración mínima recomendada para producción con Alta Disponibilidad.

**Configuración:** `minio/docker-compose.yml` (Swarm Stack)
**Infraestructura:** 4 VPS conectados en Swarm.
**Costo:** ~$160/mes (4 servidores de $40)

```bash
# Despliegue inicial
docker stack deploy -c docker-compose.yml minio-stack
```

## 🏗️ Cómo Funciona el Cluster

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  VPS 1   │  │  VPS 2   │  │  VPS 3   │  │  VPS 4   │
│ [minio1] │  │ [minio2] │  │ [minio3] │  │ [minio4] │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
              Red Overlay (Swarm)
```

-   **Alta Disponibilidad:** Si cae 1 VPS, el cluster sigue funcionando (lectura/escritura).
-   **Balanceo:** Dokploy/Traefik distribuye el tráfico entre los nodos activos.
-   **Datos:** Distribuidos con Erasure Coding (EC:4).

## 📈 Estrategia de Escalamiento

MinIO escala en **grupos de 4 nodos** (Erasure Set).

### Fase 1: Inicio (4 Nodos)

-   **Capacidad:** ~2TB útiles (con discos de 1TB)
-   **Rendimiento:** Alto
-   **Tolerancia:** 1 nodo caído (o hasta 2 dependiendo de configuración EC)

### Fase 2: Expansión (8 Nodos)

-   **Cuándo:** Cuando llenes el 70% de espacio o necesites más IOPS.
-   **Acción:** Agregar 4 VPS más al Swarm.

### ⚠️ Reglas de Hardware para la Expansión

1.  **Regla de Oro:** Siempre agregar **4 VPS** a la vez. No se puede agregar 1, 2 o 3.
2.  **Heterogeneidad Permitida:**
    -   **RAM/CPU:** Los nuevos 4 VPS pueden ser **diferentes** a los primeros 4. (Ej: Grupo 1 de 4GB RAM + Grupo 2 de 16GB RAM es válido).
    -   **Discos:** Los nuevos 4 VPS pueden tener discos **más grandes**. (Ej: Grupo 1 de 100GB + Grupo 2 de 1TB es válido).
    -   **Recomendación:** Dentro del _mismo_ grupo de 4, intenta que sean iguales para evitar cuellos de botella.

### Fase 3: Masivo (12+ Nodos)

-   **Cuándo:** Escala masiva.
-   **Acción:** Seguir agregando bloques de 4 VPS.

## 🔧 Guía Paso a Paso: Escalar de 4 a 8 Nodos

### 1. Preparar Infraestructura

Compra 4 nuevos VPS y únelos al Swarm:

```bash
# En el Manager
docker swarm join-token worker
# En los nuevos VPS
docker swarm join ...
```

### 2. Etiquetar Nodos

Asigna las etiquetas para que MinIO sepa dónde colocar los nuevos contenedores:

```bash
docker node update --label-add minio-node=5 <HOSTNAME-VPS5>
docker node update --label-add minio-node=6 <HOSTNAME-VPS6>
docker node update --label-add minio-node=7 <HOSTNAME-VPS7>
docker node update --label-add minio-node=8 <HOSTNAME-VPS8>
```

### 3. Actualizar `docker-compose.yml`

1.  **Cambiar comando:**

    ```yaml
    x-minio-common: &minio-common
        command: server http://minio{1...8}/data{1...2} ...
    ```

2.  **Duplicar servicios:**
    Copia el bloque de `minio1` y crea `minio5`, `minio6`, `minio7`, `minio8`.
    Asegúrate de actualizar:
    -   `hostname: minio5`
    -   `constraints: node.labels.minio-node == 5`
    -   Y así sucesivamente.

### 4. Redesplegar

Actualiza el stack en caliente:

```bash
docker stack deploy -c docker-compose.yml minio-stack
```

MinIO detectará los nuevos nodos, los unirá al cluster y comenzará a usarlos para nuevos objetos.

## 📊 Monitoreo del Cluster

### Ver Estado de Nodos

```bash
# Ejecutar en cualquier nodo activo
docker exec $(docker ps -q -f name=minio1) mc admin info local
```

### Ver Uso de Disco

```bash
docker exec $(docker ps -q -f name=minio1) df -h /data1 /data2
```

## 💡 Mejores Prácticas

1.  **Recursos Homogéneos:** Intenta que todos los VPS tengan CPU/RAM similares.
2.  **Límites de Recursos:** Configura `deploy.resources` en cada servicio según la capacidad real del VPS (ej: 3GB RAM para VPS de 4GB).
3.  **Monitoreo:** Usa Prometheus/Grafana para vigilar el uso de disco y decidir cuándo escalar.
4.  **Red:** Asegúrate de que la latencia entre VPS sea baja (mismo datacenter/región).

---

**Recuerda:** El escalado de almacenamiento es una operación delicada. Haz backups críticos antes de expandir el cluster.
