# Integración Dokploy + Prometheus + Grafana

Guía completa para usar Dokploy junto con Prometheus y Grafana.

## 🎯 Comparación: Dokploy vs Prometheus + Grafana

### Dokploy (Monitoreo Integrado)

**Incluye:**

-   ✅ Dashboard básico de contenedores
-   ✅ CPU, RAM, Network por contenedor
-   ✅ Logs en tiempo real
-   ✅ Estado de servicios (up/down)
-   ✅ Integrado en la UI

**Ventajas:**

-   ✅ Ya está instalado (gratis)
-   ✅ Fácil de usar (UI simple)
-   ✅ No requiere configuración
-   ✅ Suficiente para casos básicos
-   ✅ Agregar proyectos es automático

**Limitaciones:**

-   ❌ Métricas básicas (no específicas de MinIO/Citus)
-   ❌ Sin alertas personalizadas
-   ❌ Sin historial largo (solo tiempo real)
-   ❌ No puedes crear dashboards personalizados
-   ❌ No métricas de aplicación (solo contenedores)

### Prometheus + Grafana (Monitoreo Avanzado)

**Incluye:**

-   ✅ Métricas específicas de MinIO (requests, buckets, storage)
-   ✅ Métricas específicas de Citus (queries, connections, shards)
-   ✅ Alertas personalizadas (email, Slack, webhook)
-   ✅ Historial largo (meses/años)
-   ✅ Dashboards personalizados
-   ✅ Correlación de métricas
-   ✅ Predicción de tendencias

**Ventajas:**

-   ✅ Métricas detalladas de aplicaciones
-   ✅ Alertas automáticas
-   ✅ Dashboards profesionales
-   ✅ Análisis histórico
-   ✅ Estándar de la industria

**Desventajas:**

-   ❌ Requiere configuración manual
-   ❌ Más complejo
-   ❌ Usa recursos adicionales
-   ❌ Agregar proyectos es manual

## 📊 Qué Muestra Cada Uno

### Dokploy te muestra:

```
MinIO Container:
├── CPU: 45%
├── RAM: 2.1GB
├── Network: 150MB/s
└── Status: Running
```

### Prometheus + Grafana te muestra:

```
MinIO Métricas:
├── CPU: 45%
├── RAM: 2.1GB
├── Requests/s: 850
├── Buckets: 15
├── Storage usado: 45GB
├── Objetos totales: 125,000
├── Latencia promedio: 45ms
├── Errores: 2 en última hora
├── Tendencia: +15% esta semana
└── Predicción: Necesitarás escalar en 2 semanas
```

## 🎯 Cuándo Usar Cada Uno

### Usa Solo Dokploy Si:

-   ✅ Estás empezando
-   ✅ Pocos servicios (< 5)
-   ✅ Solo necesitas saber si está funcionando
-   ✅ No necesitas alertas
-   ✅ Tráfico bajo/moderado

**Ejemplo:**

```
Proyecto pequeño:
- 1 MinIO
- 1 Citus
- 2-3 apps
→ Dokploy es suficiente
```

### Usa Prometheus + Grafana Si:

-   ✅ Producción seria
-   ✅ Necesitas alertas automáticas
-   ✅ Quieres saber CUÁNDO escalar
-   ✅ Múltiples servicios
-   ✅ Necesitas métricas específicas

**Ejemplo:**

```
Proyecto en crecimiento:
- MinIO con tráfico variable
- Citus con múltiples DBs
- Necesitas saber cuándo agregar workers
→ Prometheus + Grafana
```

### Usa Ambos (Recomendado) ⭐

**Dokploy para:**

-   Vista rápida del estado
-   Logs en tiempo real
-   Gestión de servicios
-   Deploy de aplicaciones

**Prometheus + Grafana para:**

-   Métricas detalladas
-   Alertas automáticas
-   Análisis histórico
-   Decisiones de escalado

## 🔧 Configuración Integrada

### 1. Prometheus Recolecta de Dokploy

```yaml
# prometheus.yml
scrape_configs:
    # Dokploy (si expone métricas)
    - job_name: "dokploy"
      static_configs:
          - targets: ["dokploy:9090"]

    # MinIO
    - job_name: "minio"
      metrics_path: /minio/v2/metrics/cluster
      static_configs:
          - targets: ["minio:9000"]

    # Citus
    - job_name: "citus"
      static_configs:
          - targets: ["citus-master:5432"]

    # Docker (todos los contenedores gestionados por Dokploy)
    - job_name: "docker"
      static_configs:
          - targets: ["node-exporter:9100"]
```

### 2. Dashboard Unificado en Grafana

```
┌─────────────────────────────────────┐
│  Dashboard: Infraestructura         │
├─────────────────────────────────────┤
│  Dokploy:                           │
│  - Proyectos activos: 5             │
│  - Contenedores: 12                 │
│                                     │
│  MinIO:                             │
│  - Requests/s: 850                  │
│  - Storage: 45GB                    │
│                                     │
│  Citus:                             │
│  - Queries/s: 1200                  │
│  - Conexiones: 45                   │
│                                     │
│  Servidor:                          │
│  - CPU: 65%                         │
│  - RAM: 12GB / 16GB                 │
└─────────────────────────────────────┘
```

## 💡 Ejemplo de Uso Conjunto

### Escenario: MinIO con Alto Tráfico

**1. Prometheus detecta:**

```
MinIO requests/s > 1000 por 5 minutos
```

**2. Alerta enviada:**

```
📧 Email: "MinIO alto tráfico - considerar escalar"
```

**3. Verificas en Grafana:**

```
Dashboard MinIO:
- Requests: 1250/s (tendencia: +20% esta semana)
- CPU: 75%
- RAM: 3.2GB
- Predicción: Necesitarás escalar en 1 semana
```

**4. Verificas en Dokploy:**

```
MinIO Container:
- Status: Running
- CPU: 75%
- RAM: 3.2GB
- Logs: Sin errores
```

**5. Decides escalar:**

```bash
# Opción A: Escalar verticalmente en Dokploy
# UI → MinIO → Settings → Resources → Aumentar límites

# Opción B: Escalar horizontalmente
cd minio/distributed
./deploy.sh
```

**6. Monitoreas resultado en Grafana:**

```
Después de escalar:
- Requests: 1250/s (mismo)
- CPU: 35% (mejor)
- RAM: 2.1GB (mejor)
✅ Escalado exitoso
```

## 📋 Comparación Detallada

| Característica                | Dokploy                 | Prometheus + Grafana               |
| ----------------------------- | ----------------------- | ---------------------------------- |
| **Instalación**               | ✅ Incluido             | ⚠️ Manual                          |
| **Configuración**             | ✅ Ninguna              | ⚠️ Requiere setup                  |
| **Agregar proyectos**         | ✅ Automático (2 min)   | ⚠️ Manual (15-30 min)              |
| **CPU/RAM contenedores**      | ✅ Sí                   | ✅ Sí                              |
| **Métricas MinIO**            | ❌ No                   | ✅ Sí (requests, storage, etc.)    |
| **Métricas Citus**            | ❌ No                   | ✅ Sí (queries, connections, etc.) |
| **Alertas**                   | ❌ No                   | ✅ Sí (email, Slack, etc.)         |
| **Historial**                 | ⚠️ Limitado             | ✅ Ilimitado                       |
| **Dashboards personalizados** | ❌ No                   | ✅ Sí                              |
| **Predicción de tendencias**  | ❌ No                   | ✅ Sí                              |
| **Gestión de servicios**      | ✅ Sí (deploy, restart) | ❌ No                              |
| **Logs en tiempo real**       | ✅ Sí                   | ❌ No                              |

## 🎯 Estrategia Recomendada

### Fase 1: Solo Dokploy (Ahora)

```
✅ Usa el monitoreo integrado de Dokploy
✅ Suficiente para empezar
✅ Sin configuración adicional
```

**Cuándo:**

-   Desarrollo
-   < 10K usuarios
-   Tráfico predecible

### Fase 2: Agregar Prometheus + Grafana (Cuando crezcas)

```
✅ Cuando tengas > 10K usuarios
✅ Cuando necesites alertas
✅ Cuando quieras predecir escalado
```

**Cuándo:**

-   Producción seria
-   Tráfico variable
-   Necesitas alertas

### Fase 3: Ambos (Producción)

```
Dokploy: Vista rápida diaria + Gestión
Prometheus + Grafana: Análisis profundo + Alertas
```

**Cuándo:**

-   Producción crítica
-   Múltiples servicios
-   Equipo técnico

## 🚀 Setup Rápido

```bash
# 1. Dokploy (ya lo tienes)
# Gestión de proyectos y monitoreo básico

# 2. Agregar Prometheus + Grafana
cd arquitectura/monitoring
docker compose up -d

# 3. Configurar Prometheus para recolectar de:
# - Dokploy (si expone métricas)
# - MinIO
# - Citus
# - Docker

# 4. Importar dashboards en Grafana

# 5. Configurar alertas

# ✅ Listo: Trabajan juntos
```

## 🎓 Resumen

**¿Pueden trabajar juntos?**

-   ✅ SÍ, perfectamente

**¿Cómo se complementan?**

-   Dokploy: Gestión y deploy
-   Prometheus: Recolección de métricas
-   Grafana: Visualización y alertas

**¿Deberías usarlos juntos?**

-   ✅ SÍ, es la mejor configuración
-   Cada uno hace lo que mejor sabe
-   No se duplican, se complementan

**Workflow ideal:**

-   Día a día → Dokploy
-   Análisis → Grafana
-   Alertas → Prometheus
-   Escalado → Dokploy o manual

**Recomendación final:**

1. Empieza con solo Dokploy
2. Agrega Prometheus + Grafana cuando crezcas
3. Usa ambos en producción (se complementan)

---

Ver también: [MONITORING.md](MONITORING.md) para configuración detallada de Prometheus + Grafana
