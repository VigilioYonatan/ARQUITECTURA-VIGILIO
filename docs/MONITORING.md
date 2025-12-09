# MinIO/Citus - Monitoreo y Alertas para Escalado

Configuración de monitoreo con Prometheus y Grafana para saber cuándo escalar.

## 🎯 Objetivo

**En lugar de auto-scaling automático:**

-   ✅ Monitorear métricas en tiempo real
-   ✅ Recibir alertas cuando recursos están altos
-   ✅ Decidir manualmente cuándo escalar
-   ✅ Simple, confiable y económico

## 📊 Stack de Monitoreo

```
MinIO/Citus → Prometheus → Grafana → Alertas
```

## 🚀 Configuración

### 1. Docker Compose para Monitoreo

```yaml
# monitoring/docker-compose.yml
version: "3.8"

services:
    prometheus:
        image: prom/prometheus:latest
        container_name: prometheus
        restart: unless-stopped
        ports:
            - "9090:9090"
        volumes:
            - ./prometheus.yml:/etc/prometheus/prometheus.yml
            - prometheus_data:/prometheus
        command:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus"
        networks:
            - monitoring

    grafana:
        image: grafana/grafana:latest
        container_name: grafana
        restart: unless-stopped
        ports:
            - "3001:3000"
        environment:
            - GF_SECURITY_ADMIN_PASSWORD=admin
            - GF_USERS_ALLOW_SIGN_UP=false
        volumes:
            - grafana_data:/var/lib/grafana
            - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
            - ./grafana/datasources:/etc/grafana/provisioning/datasources
        networks:
            - monitoring
        depends_on:
            - prometheus

    alertmanager:
        image: prom/alertmanager:latest
        container_name: alertmanager
        restart: unless-stopped
        ports:
            - "9093:9093"
        volumes:
            - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
        command:
            - "--config.file=/etc/alertmanager/alertmanager.yml"
        networks:
            - monitoring

volumes:
    prometheus_data:
    grafana_data:

networks:
    monitoring:
        driver: bridge
    dokploy-network:
        external: true
```

### 2. Configuración de Prometheus

```yaml
# monitoring/prometheus.yml
global:
    scrape_interval: 15s
    evaluation_interval: 15s

# Reglas de alertas
rule_files:
    - "alerts.yml"

# Alertmanager
alerting:
    alertmanagers:
        - static_configs:
              - targets: ["alertmanager:9093"]

scrape_configs:
    # MinIO metrics
    - job_name: "minio"
      metrics_path: /minio/v2/metrics/cluster
      static_configs:
          - targets: ["minio:9000"] # o minio1:9000 para distributed

    # Citus metrics
    - job_name: "citus"
      static_configs:
          - targets: ["citus-master:5432"]

    # Node exporter (métricas del servidor)
    - job_name: "node"
      static_configs:
          - targets: ["node-exporter:9100"]
```

### 3. Reglas de Alertas

```yaml
# monitoring/alerts.yml
groups:
    - name: minio_alerts
      interval: 30s
      rules:
          # CPU alto
          - alert: MinioCPUHigh
            expr: rate(process_cpu_seconds_total{job="minio"}[5m]) > 0.8
            for: 5m
            labels:
                severity: warning
            annotations:
                summary: "MinIO CPU alto"
                description: "MinIO está usando >80% CPU por 5 minutos"

          # RAM alta
          - alert: MinioMemoryHigh
            expr: process_resident_memory_bytes{job="minio"} / 1024 / 1024 / 1024 > 3
            for: 5m
            labels:
                severity: warning
            annotations:
                summary: "MinIO RAM alta"
                description: "MinIO está usando >3GB RAM"

          # Muchas requests
          - alert: MinioHighRequests
            expr: rate(minio_s3_requests_total[5m]) > 1000
            for: 5m
            labels:
                severity: info
            annotations:
                summary: "MinIO alto tráfico"
                description: "MinIO recibiendo >1000 req/s"

    - name: citus_alerts
      interval: 30s
      rules:
          # Conexiones altas
          - alert: CitusConnectionsHigh
            expr: pg_stat_database_numbackends > 80
            for: 5m
            labels:
                severity: warning
            annotations:
                summary: "Citus conexiones altas"
                description: "Citus tiene >80 conexiones activas"

          # Disco lleno
          - alert: CitusDiskFull
            expr: pg_database_size_bytes / 1024 / 1024 / 1024 > 50
            for: 5m
            labels:
                severity: critical
            annotations:
                summary: "Citus disco lleno"
                description: "Base de datos >50GB"
```

### 4. Configuración de Alertmanager

```yaml
# monitoring/alertmanager.yml
global:
    resolve_timeout: 5m

route:
    group_by: ["alertname"]
    group_wait: 10s
    group_interval: 10s
    repeat_interval: 12h
    receiver: "email"

receivers:
    # Email
    - name: "email"
      email_configs:
          - to: "tu-email@example.com"
            from: "alertas@example.com"
            smarthost: "smtp.gmail.com:587"
            auth_username: "tu-email@gmail.com"
            auth_password: "tu-app-password"

    # Slack (opcional)
    - name: "slack"
      slack_configs:
          - api_url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
            channel: "#alertas"
            title: "Alerta de Infraestructura"

    # Webhook (opcional)
    - name: "webhook"
      webhook_configs:
          - url: "http://tu-servidor:3000/api/alerts"
```

### 5. Node Exporter (Métricas del Servidor)

```yaml
# Agregar a docker-compose.yml
node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
        - "9100:9100"
    volumes:
        - /proc:/host/proc:ro
        - /sys:/host/sys:ro
        - /:/rootfs:ro
    command:
        - "--path.procfs=/host/proc"
        - "--path.sysfs=/host/sys"
        - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    networks:
        - monitoring
```

## 📈 Dashboards de Grafana

### Dashboard de MinIO

```json
// grafana/dashboards/minio.json
{
    "dashboard": {
        "title": "MinIO Monitoring",
        "panels": [
            {
                "title": "CPU Usage",
                "targets": [
                    {
                        "expr": "rate(process_cpu_seconds_total{job=\"minio\"}[5m]) * 100"
                    }
                ]
            },
            {
                "title": "Memory Usage",
                "targets": [
                    {
                        "expr": "process_resident_memory_bytes{job=\"minio\"} / 1024 / 1024 / 1024"
                    }
                ]
            },
            {
                "title": "Requests per Second",
                "targets": [
                    {
                        "expr": "rate(minio_s3_requests_total[5m])"
                    }
                ]
            },
            {
                "title": "Storage Used",
                "targets": [
                    {
                        "expr": "minio_bucket_usage_total_bytes / 1024 / 1024 / 1024"
                    }
                ]
            }
        ]
    }
}
```

## 🚀 Iniciar Monitoreo

```bash
# 1. Crear directorio
mkdir -p monitoring/grafana/{dashboards,datasources}

# 2. Copiar archivos de configuración
# (prometheus.yml, alerts.yml, alertmanager.yml)

# 3. Iniciar stack de monitoreo
cd monitoring
docker compose up -d

# 4. Acceder a Grafana
# http://localhost:3001
# Usuario: admin
# Password: admin
```

## 📊 Métricas Clave a Monitorear

### MinIO

-   **CPU**: > 80% por 5 minutos → Considera escalar
-   **RAM**: > 80% del límite → Aumenta límites o escala
-   **Requests/s**: > 1000 → Considera distributed
-   **Storage**: > 80% → Agrega más espacio

### Citus

-   **Conexiones**: > 80 → Agrega workers
-   **CPU por worker**: > 80% → Agrega workers
-   **Tamaño DB**: > 50GB → Considera más workers
-   **Query time**: > 1s promedio → Optimiza o escala

## 🔔 Proceso de Escalado

### 1. Recibir Alerta

```
📧 Email: "MinIO CPU >80% por 5 minutos"
```

### 2. Verificar en Grafana

```
http://localhost:3001
→ Ver dashboard de MinIO
→ Confirmar métricas
```

### 3. Decidir Acción

**Opción A: Escalar Verticalmente**

```yaml
# Aumentar límites
limits:
    cpus: "4" # Era 2
    memory: 8G # Era 4G
```

**Opción B: Escalar Horizontalmente**

```bash
# Agregar worker (Citus)
cd worker
./deploy.sh worker3 10.0.0.1

# O migrar a distributed (MinIO)
cd distributed
./deploy.sh
```

### 4. Monitorear Resultado

```
→ Ver si métricas bajan
→ Ajustar alertas si es necesario
```

## 🎯 Umbrales Recomendados

### Alertas de Advertencia (Warning)

-   CPU > 70% por 5 minutos
-   RAM > 75% por 5 minutos
-   Requests > 500/s por 5 minutos

### Alertas Críticas (Critical)

-   CPU > 90% por 2 minutos
-   RAM > 90% por 2 minutos
-   Disco > 90%
-   Servicio caído

## 📝 Checklist de Escalado

Cuando recibes alerta:

-   [ ] Verificar métricas en Grafana
-   [ ] Confirmar que no es un pico temporal
-   [ ] Revisar logs para errores
-   [ ] Decidir: vertical u horizontal
-   [ ] Ejecutar escalado
-   [ ] Monitorear por 24 horas
-   [ ] Ajustar alertas si es necesario

## 🎓 Resumen

**Monitoreo + Alertas es la mejor opción porque:**

-   ✅ Simple de configurar
-   ✅ Bajo costo (solo contenedores de monitoreo)
-   ✅ Control total (tú decides cuándo escalar)
-   ✅ Confiable (no escala sin tu aprobación)
-   ✅ Aprende de patrones de uso

**NO necesitas:**

-   ❌ Kubernetes
-   ❌ Auto-scaling complejo
-   ❌ Configuración avanzada

---

**Tiempo de setup:** ~30 minutos
**Costo adicional:** ~$0 (solo recursos del servidor)
**Mantenimiento:** Mínimo
