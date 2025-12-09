# Arquitectura de Infraestructura

Configuración completa de MinIO (almacenamiento S3) y Citus (PostgreSQL distribuido) con escalamiento horizontal.

## 📁 Estructura del Proyecto

```
arquitectura/
├── minio/                    # Almacenamiento S3
│   ├── single-node/         # ⭐ Simple (1 servidor)
│   ├── distributed/         # Distribuido (4 nodos)
│   ├── shared/              # Archivos compartidos
│   └── docs/                # Documentación
│
├── citus/                   # PostgreSQL Distribuido
│   ├── coordinator/         # Servidor coordinator
│   ├── worker/              # Servidores workers
│   ├── shared/              # Archivos compartidos
│   ├── docker-compose.yml   # ⭐ Desarrollo local
│   └── docs/                # Documentación
│
└── docs/                    # Documentación general
    ├── MONITORING.md        # Prometheus + Grafana
    └── DOKPLOY-INTEGRATION.md  # Integración con Dokploy
```

## 🚀 Inicio Rápido

### MinIO (Almacenamiento)

```bash
# Desarrollo/Producción simple
cd minio/single-node
docker compose up -d

# Acceso:
# API: http://localhost:9000
# Console: http://localhost:9001
```

### Citus (Base de Datos)

```bash
# Desarrollo local
cd citus
docker compose up -d

# Con CloudBeaver (admin UI)
docker compose --profile admin up -d

# Acceso:
# PostgreSQL: localhost:5432
# CloudBeaver: http://localhost:8978
```

## 📚 Documentación

### MinIO

-   [README.md](minio/README.md) - Guía principal
-   [BEST-PRACTICES.md](minio/docs/BEST-PRACTICES.md) - Mejores prácticas
-   [UPLOAD-BEST-PRACTICE.md](minio/docs/UPLOAD-BEST-PRACTICE.md) - Subida con presigned URLs
-   [SCALING.md](minio/docs/SCALING.md) - Escalamiento horizontal

### Citus

-   [README.md](citus/README.md) - Guía principal
-   [MULTI-PROJECT.md](citus/docs/MULTI-PROJECT.md) - Múltiples proyectos
-   [CLOUDBEAVER.md](citus/docs/CLOUDBEAVER.md) - Gestión visual
-   [SCALING.md](citus/docs/SCALING.md) - Escalamiento horizontal

### Monitoreo

-   [MONITORING.md](docs/MONITORING.md) - Prometheus + Grafana
-   [DOKPLOY-INTEGRATION.md](docs/DOKPLOY-INTEGRATION.md) - Integración con Dokploy

## 🎯 Características Principales

### MinIO

-   ✅ Compatible con S3
-   ✅ Single-node o distribuido
-   ✅ Presigned URLs (subida directa)
-   ✅ Versionado de objetos
-   ✅ Lifecycle policies
-   ✅ Escalamiento horizontal

### Citus

-   ✅ PostgreSQL distribuido
-   ✅ Múltiples bases de datos
-   ✅ Sharding automático
-   ✅ CloudBeaver para gestión
-   ✅ Escalamiento horizontal
-   ✅ Alta disponibilidad

### Monitoreo

-   ✅ Dokploy (integrado)
-   ✅ Prometheus + Grafana (opcional)
-   ✅ Alertas automáticas
-   ✅ Dashboards personalizados

## 💰 Costos Estimados

### Desarrollo

```
1 servidor (8GB RAM): $40-80/mes
- MinIO single-node
- Citus local
- Dokploy
```

### Producción Pequeña

```
1 servidor potente (16GB RAM): $80-120/mes
- MinIO single-node
- Citus (1 coordinator + 2 workers)
- Dokploy + Monitoreo
```

### Producción Grande

```
5+ servidores: $200-500/mes
- MinIO distributed (4 nodos)
- Citus (1 coordinator + 4 workers)
- Dokploy + Prometheus + Grafana
```

## 🎓 Mejores Prácticas

### MinIO

1. Usa presigned URLs (archivos no pasan por tu servidor)
2. Límites de recursos (protege otras apps)
3. Single-node para empezar, distributed cuando crezcas
4. Monitorea requests/s y storage

### Citus

1. Una base de datos por proyecto
2. Distribuye tablas grandes (> 1M registros)
3. Co-localiza datos relacionados
4. Usa CloudBeaver para gestión visual

### Escalamiento

1. Empieza simple (single-node)
2. Monitorea métricas (Dokploy o Grafana)
3. Escala verticalmente primero
4. Escala horizontalmente cuando sea necesario
5. NO es automático (manual pero fácil)

### Monitoreo

1. Usa Dokploy para día a día
2. Agrega Prometheus + Grafana para producción
3. Configura alertas (CPU >80%, RAM >80%)
4. Revisa métricas semanalmente

## 🔧 Comandos Útiles

### MinIO

```bash
# Ver estado
docker exec minio mc admin info local

# Crear bucket
docker exec minio mc mb local/mybucket

# Listar usuarios
docker exec minio mc admin user list local
```

### Citus

```bash
# Conectar a PostgreSQL
docker exec -it citus-master psql -U postgres -d myapp

# Ver workers
SELECT * FROM citus_get_active_worker_nodes();

# Ver tablas distribuidas
SELECT * FROM citus_tables;
```

## 🎯 Próximos Pasos

1. **Iniciar servicios**

    ```bash
    cd minio/single-node && docker compose up -d
    cd citus && docker compose up -d
    ```

2. **Configurar aplicaciones**

    - MinIO: Usar SDK con presigned URLs
    - Citus: Crear bases de datos por proyecto

3. **Monitorear**

    - Usar Dokploy para vista rápida
    - Agregar Prometheus + Grafana cuando crezcas

4. **Escalar cuando sea necesario**
    - Monitorea métricas
    - Escala verticalmente primero
    - Escala horizontalmente si es necesario

---

**Todo está listo para desarrollo y producción. Empieza simple, escala cuando lo necesites.**
