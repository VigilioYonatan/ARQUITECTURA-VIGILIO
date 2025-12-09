# MinIO - Temas Importantes y Mejores Prácticas

## 🎯 Límites de Recursos

### ¿Por Qué Usar Límites?

**Sin límites:**

-   ❌ MinIO puede consumir TODA la RAM del servidor
-   ❌ Otras apps (Citus, etc.) se quedan sin recursos
-   ❌ Comportamiento impredecible

**Con límites:**

-   ✅ Protege otras aplicaciones
-   ✅ Comportamiento predecible
-   ✅ Fácil de planificar capacidad

### Configuración Recomendada

```yaml
deploy:
    resources:
        limits:
            cpus: "2" # Máximo 2 CPUs
            memory: 4G # Máximo 4GB RAM
        reservations:
            cpus: "0.5" # Mínimo 0.5 CPUs garantizados
            memory: 1G # Mínimo 1GB RAM garantizado
```

**Soporta:** 50-100 usuarios simultáneos

### Ajustar Según Servidor

**Servidor pequeño (4GB RAM):**

```yaml
limits:
    cpus: "1"
    memory: 2G
```

**Servidor grande (16GB RAM):**

```yaml
limits:
    cpus: "4"
    memory: 8G
```

## 📁 Archivos Grandes y RAM

### Mito vs Realidad

**❌ MITO:**

```
Archivo de 10GB → Necesita 10GB de RAM
```

**✅ REALIDAD:**

```
Archivo de 10GB → Usa ~10-50MB de RAM (streaming)
```

### Cómo Funciona

MinIO usa **streaming** (no carga todo en memoria):

```
Archivo de 10GB:
├── Lee chunk de 10MB → Escribe a disco → Libera RAM
├── Lee chunk de 10MB → Escribe a disco → Libera RAM
└── Repite hasta terminar

RAM máxima usada: ~50MB (no 10GB)
```

### ¿Qué SÍ Consume RAM?

1. **Conexiones simultáneas** (principal)

    - 10 usuarios = ~100-500MB
    - 100 usuarios = ~1-2GB
    - 1000 usuarios = ~4-8GB

2. **Metadata y caché** (~100-500MB)

3. **NO el tamaño de archivos**

## 🚀 Alta Concurrencia

### Problema

```
100 personas subiendo simultáneamente:
├── RAM necesaria: ~2-4GB
├── CPU necesaria: ~2-4 cores
└── Puede saturarse si límites son bajos
```

### Soluciones

#### 1. Aumentar Límites (Corto Plazo)

```yaml
limits:
    cpus: "4"
    memory: 8G
```

**Soporta:** ~200-300 usuarios simultáneos

#### 2. MinIO Distribuido (Largo Plazo) ⭐

```
4 servidores = 4× capacidad
Soporta: ~400-800 usuarios simultáneos
```

#### 3. Presigned URLs (Mejor Práctica)

**Usuario sube DIRECTAMENTE a MinIO:**

```javascript
// Backend: Generar URL firmada
const url = await minioClient.presignedPutObject(
    "bucket",
    "file.pdf",
    3600 // Válida 1 hora
);

// Frontend: Subir directamente
await fetch(url, {
    method: "PUT",
    body: file,
});
```

**Ventajas:**

-   ✅ No pasa por tu servidor backend
-   ✅ Escala infinitamente
-   ✅ Más rápido
-   ✅ Ahorra recursos

## 🔄 Colas: ¿Cuándo Usar?

### ❌ NO usar colas para:

**Subidas de usuarios (mala UX):**

```javascript
// MALO
await uploadQueue.add(() => uploadFile());
// Usuario espera en cola → Mala experiencia
```

### ✅ SÍ usar colas para:

**Procesamiento en background:**

```javascript
// Usuario sube archivo (directo, sin cola)
await minioClient.fPutObject("bucket", "video.mp4", file);
// ✅ Usuario ve: "Archivo subido"

// Background (con cola)
await processingQueue.add(() => {
    generateThumbnail(file); // Generar miniatura
    scanVirus(file); // Escanear virus
    extractMetadata(file); // Extraer metadata
});
// Usuario no espera esto
```

## 📊 Capacidad por Configuración

### Single Node (4GB RAM, 2 CPUs)

-   Usuarios simultáneos: ~50-100
-   Archivos/segundo: ~20-30
-   Costo: $40/mes

### Single Node (8GB RAM, 4 CPUs)

-   Usuarios simultáneos: ~100-200
-   Archivos/segundo: ~50-80
-   Costo: $80/mes

### Distributed (4 nodos, 4GB cada uno)

-   Usuarios simultáneos: ~400-800
-   Archivos/segundo: ~200-300
-   Costo: $160/mes

## 🎯 Estrategia de Escalamiento

### Fase 1: Empezar Simple

```yaml
# Single node
limits:
    cpus: "2"
    memory: 4G
```

**Soporta:** ~50-100 usuarios

### Fase 2: Optimizar Aplicación

```javascript
// Usar presigned URLs
const uploadUrl = await getPresignedUrl();
// Usuario sube directamente
```

**Soporta:** ~200-300 usuarios

### Fase 3: Escalar Horizontalmente

```bash
# MinIO Distributed
cd distributed
./deploy.sh
```

**Soporta:** ~400-800 usuarios

## 🔐 Mejores Prácticas

### 1. Siempre Usa Límites de Recursos

```yaml
# ✅ BUENO
deploy:
    resources:
        limits:
            cpus: "2"
            memory: 4G
# ❌ MALO (sin límites)
# MinIO puede consumir todo
```

### 2. Usa Presigned URLs para Subidas

```javascript
// ✅ BUENO: Subida directa a MinIO
const url = await minioClient.presignedPutObject(...);

// ❌ MALO: Pasa por tu servidor
app.post('/upload', async (req, res) => {
    await minioClient.putObject(...);
});
```

### 3. Colas Solo para Background

```javascript
// ✅ BUENO
await uploadFile(); // Directo
await queue.add(() => process()); // Background

// ❌ MALO
await queue.add(() => uploadFile()); // Usuario espera
```

### 4. Monitorea Uso de Recursos

```bash
# Ver uso de RAM y CPU
docker stats minio

# Ver métricas
curl http://localhost:9000/minio/v2/metrics/cluster
```

### 5. Empieza Simple, Escala Cuando Necesites

```
Desarrollo → Single Node (2GB)
Producción Pequeña → Single Node (4GB)
Producción Media → Single Node (8GB)
Producción Grande → Distributed (4 nodos)
```

## 🎓 Resumen Ejecutivo

**Límites de Recursos:**

-   ✅ Siempre úsalos (protege el servidor)
-   ✅ 4GB RAM suficiente para 50-100 usuarios
-   ✅ Ajusta según tu caso

**Archivos Grandes:**

-   ✅ NO consumen mucha RAM (streaming)
-   ✅ Puedes subir 100GB con solo 2GB RAM
-   ✅ El tamaño NO importa para RAM

**Alta Concurrencia:**

-   ✅ Usa presigned URLs (mejor práctica)
-   ✅ Escala horizontalmente si necesitas
-   ✅ NO uses colas para subidas

**Escalamiento:**

-   ✅ Empieza con single-node
-   ✅ Optimiza con presigned URLs
-   ✅ Migra a distributed solo si necesitas

---

Ver también:

-   [README-DETAILED.md](README-DETAILED.md) - Guía completa de uso
-   [SCALING.md](SCALING.md) - Escalamiento horizontal
