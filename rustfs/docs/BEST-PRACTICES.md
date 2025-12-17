# 🛡️ RustFS - Best Practices (Senior Level)

## 1. 💾 Sistema de Archivos (Filesystem)

Al igual que en MinIO, la elección del sistema de archivos subyacente es crítica. RustFS se beneficia enormemente de sistemas modernos.

### Recomendado: XFS (Direct I/O)

RustFS maneja I/O de manera asíncrona (tokio-rs). XFS ofrece el mejor paralelismo para este patrón.

**Configuración XFS para Discos NVMe/SSD:**

```bash
ipv4=0 # Si no usas ipv6
mkfs.xfs -b size=4096 -n size=8192 -m crc=1,finobt=1 <device>
```

> [!TIP] > **NO uses ZFS o Btrfs** debajo de RustFS a menos que sepas exactamente lo que haces. El "Copy-on-Write" (CoW) + la propia gestión de objetos añade latencia innecesaria. RustFS ya gestiona la integridad de los datos (Erasure Coding).

## 2. 🧠 Gestión de Memoria (Rust vs GC)

A diferencia de MinIO (Go), RustFS **no tiene Garbage Collector (GC)**. Esto significa:

-   **No hay "Stop-the-world" pauses:** La latencia es extremadamente plana y predecible p99.
-   **Uso estricto de RAM:** Lo que ves es lo que se usa.

### Configuración de Límites (Cgroups)

Aunque Rust es eficiente, **SIEMPRE** pon límites en contenedores para evitar OOM Kills si un cliente malicioso abre miles de conexiones.

```yaml
deploy:
    resources:
        limits:
            memory: 4G # RustFS suele usar menos, pero protege el host.
```

## 3. 🚀 Concurrencia y Threading

RustFS usa `tokio` para concurrencia. Por defecto, intentará usar todos los cores disponibles.

### Escenario: Servidor Compartido

Si RustFS comparte servidor con Postgres o Apps:
**Limita los cores** para evitar que `tokio` robe tiempo de CPU a otros procesos en picos de carga.

```yaml
cpus: "4.0" # Limita los hilos del runtime de Rust
```

## 4. 🌐 Tuning de Kernel (Sysctl)

Para soportar miles de conexiones concurrentes (necesario para Data Lakes/IA):

```bash
# /etc/sysctl.conf

# Aumentar backlog de conexiones
net.core.somaxconn = 65535

# Puertos efímeros (útil para proxies)
net.ipv4.ip_local_port_range = 10024 65535

# TCP Fast Open (baja latencia en handshake)
net.ipv4.tcp_fastopen = 3
```

## 5. 🔒 Seguridad

### TLS/SSL

Rust usa `rustls` (normalmente) que es más seguro y rápido que OpenSSL legacy.

-   **Terminación TLS:** RustFS es muy rápido haciendo TLS, pero en arquitectura Enterprise se recomienda un **Reverse Proxy (Nginx/Traefik)** o Load Balancer dedicado para gestionar certificados centralizadamente.

### Usuarios

-   Crea usuarios con políticas `ReadOnly` para servicios de ML/Analytics.
-   Rota las keys periódicamente.

## 6. 📊 Monitoreo (Prometheus)

RustFS expone métricas compatibles con Prometheus (usualmente en `/metrics` o endpoint S3 compatible).
**KPIs Clave a vigilar:**

1.  **Syscall Latency:** Gracias a Rust, esto debería ser <1ms en NVMe.
2.  **Open File Descriptors:** RustFS es eficiente, pero cada conexión consume uno. `ulimit -n 65535` es obligatorio.
