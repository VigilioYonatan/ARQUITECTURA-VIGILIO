# RustFS - Almacenamiento de Objetos de Alto Rendimiento (Rust)

> [!IMPORTANT]
> RustFS es una alternativa emergente a MinIO escrita en **Rust**. Promete **mayor rendimiento** (especialmente en archivos pequeños) y **seguridad de memoria** (memory safety) nativa.

Esta configuración es una implementación **"Senior Level"** lista para evaluar en entornos de pre-producción o Data Lakes de alto rendimiento.

## 🚀 ¿Por qué RustFS? (vs MinIO)

| Característica        | MinIO (Go)                       | RustFS (Rust)                  |
| :-------------------- | :------------------------------- | :----------------------------- |
| **Lenguaje**          | Go (con GC)                      | Rust (Sin GC, Memory Safe)     |
| **Rendimiento (4KB)** | Muy Bueno                        | **Excelente (~2.3x vs MinIO)** |
| **Consumo RAM**       | Moderado                         | **Bajo / Eficiente**           |
| **Latencia**          | Baja                             | **Ultra Baja (Predecible)**    |
| **Madurez**           | Estándar de Industria (10+ años) | Emergente / Rápida Evolución   |

## 🛠️ Inicio Rápido

```bash
docker-compose up -d
```

-   **API S3:** `http://localhost:9000`
-   **Consola:** `http://localhost:9001`
-   **Usuario:** `admin`
-   **Password:** `password123`

## 📂 Estructura Documental

Documentación detallada nivel Senior:

-   [📒 BEST-PRACTICES.md](docs/BEST-PRACTICES.md): Tuning de sistema, FS y optimizaciones Rust.
-   [📈 SCALING.md](docs/SCALING.md): Arquitectura distribuida y escalamiento.
-   [🆚 COMPARISON-MINIO.md](docs/COMPARISON-MINIO.md): Comparativa técnica profunda para decisores.

## ⚠️ Consideraciones de Producción (2026)

A Diciembre de 2026, RustFS ha madurado significativamente para cargas de trabajo de **IA y Data Lakes**. Para almacenamiento de propósito general crítico ("Tier 1"), se recomienda realizar benchmarks con su propia data ("Trust but Verify").

### Networking

Se recomienda usar `host` networking en Linux para evitar el overhead del bridge de Docker en cargas >10Gbps.

```yaml
network_mode: "host"
```
