# MinIO - Almacenamiento Centralizado para Múltiples Proyectos

## 🎯 Concepto: Un MinIO para Todos tus Proyectos

MinIO funciona como **almacenamiento centralizado** para todos tus proyectos Node.js.

### Arquitectura

```
┌─────────────────────────────────────────────┐
│         TUS PROYECTOS (Node.js)             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │App 1 │ │App 2 │ │App 3 │ │App 4 │       │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘       │
└─────┼────────┼────────┼────────┼────────────┘
      │        │        │        │
      └────────┴────────┴────────┘
                  ↓
      ┌───────────────────────┐
      │   DOKPLOY (opcional)  │
      │   Load Balancer       │
      └───────────────────────┘
                  ↓
      ┌───────────────────────┐
      │   MINIO (1 servidor)  │
      │   - bucket: app1      │
      │   - bucket: app2      │
      │   - bucket: app3      │
      │   - bucket: app4      │
      └───────────────────────┘
```

## ✅ Por Qué Usar MinIO en Todos los Proyectos

### 1. Almacenamiento Centralizado

**Sin MinIO (descentralizado):**

```
Proyecto 1: Almacena archivos en su propio servidor
Proyecto 2: Almacena archivos en su propio servidor
Proyecto 3: Almacena archivos en su propio servidor

Problemas:
- ❌ 3 servidores con almacenamiento
- ❌ Gestión fragmentada
- ❌ Más costoso
```

**Con MinIO (centralizado):**

```
MinIO (1 servidor):
├── Proyecto 1: bucket 'app1-uploads'
├── Proyecto 2: bucket 'app2-media'
└── Proyecto 3: bucket 'app3-files'

Ventajas:
- ✅ 1 servidor de almacenamiento
- ✅ Gestión centralizada
- ✅ Más económico
```

### 2. Ahorro de Costos

```
Sin MinIO:
- Servidor 1 (Proyecto 1): $40/mes + 10GB storage
- Servidor 2 (Proyecto 2): $40/mes + 15GB storage
- Servidor 3 (Proyecto 3): $40/mes + 20GB storage
Total: $120/mes

Con MinIO:
- MinIO (45GB total): $40/mes
- Proyectos solo procesan lógica
Total: $40/mes

Ahorro: $80/mes
```

### 3. Escalamiento Centralizado

**Sin MinIO:**

```
Proyecto 1 crece → Escalar servidor 1
Proyecto 2 crece → Escalar servidor 2
Proyecto 3 crece → Escalar servidor 3

3 operaciones de escalado
```

**Con MinIO:**

```
Cualquier proyecto crece → Escalar MinIO una vez
Todos los proyectos se benefician

1 operación de escalado
```

## 💻 Implementación: Misma URL, Diferentes Buckets

### Todos los Proyectos Usan la Misma URL

```javascript
// Proyecto 1: E-commerce
const minioClient = new Minio.Client({
    endPoint: "minio", // ← MISMA URL
    port: 9000,
    accessKey: "admin",
    secretKey: "password",
});
await minioClient.putObject("ecommerce-products", "producto.jpg", file);
//                            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
//                         Bucket del proyecto 1

// Proyecto 2: Blog
const minioClient = new Minio.Client({
    endPoint: "minio", // ← MISMA URL
    port: 9000,
    accessKey: "admin",
    secretKey: "password",
});
await minioClient.putObject("blog-images", "post-image.jpg", file);
//                            ↑↑↑↑↑↑↑↑↑↑↑
//                         Bucket del proyecto 2

// Proyecto 3: SaaS App
const minioClient = new Minio.Client({
    endPoint: "minio", // ← MISMA URL
    port: 9000,
    accessKey: "admin",
    secretKey: "password",
});
await minioClient.putObject("saas-uploads", "user-file.pdf", file);
//                            ↑↑↑↑↑↑↑↑↑↑↑↑
//                         Bucket del proyecto 3
```

### Separación por Buckets

**Cada proyecto tiene su propio bucket:**

```javascript
// Crear buckets (una vez)
await minioClient.makeBucket('ecommerce-products');
await minioClient.makeBucket('blog-images');
await minioClient.makeBucket('saas-uploads');
await minioClient.makeBucket('api-documents');

// Cada proyecto usa su bucket
Proyecto 1 → bucket: 'ecommerce-products'
Proyecto 2 → bucket: 'blog-images'
Proyecto 3 → bucket: 'saas-uploads'
Proyecto 4 → bucket: 'api-documents'
```

## 🛡️ Protección de Datos (Versionado)

Para proteger tus archivos contra borrados accidentales, activa el **Versionado**.
Si borras un archivo, MinIO guardará una copia oculta que puedes recuperar.

docker exec minio mc version enable local/vigiliobucket

> **Nota:** Esto consumirá más espacio si sobrescribes archivos frecuentemente.

### ¿Cómo funciona? (No es como Git)

Es automático. Cada vez que subes un archivo con el mismo nombre, MinIO **no sobrescribe** el anterior, sino que lo guarda "debajo" del nuevo.

-   **Subes `foto.jpg` (v1)** -> Se guarda.
-   **Subes `foto.jpg` (v2)** -> Se guarda encima. La v1 sigue existiendo pero oculta.
-   **Borras `foto.jpg`** -> MinIO pone una marca de "Borrado", pero las v1 y v2 siguen ahí.

### Recuperar una Versión Anterior

```bash
# 1. Listar todas las versiones de un archivo
docker exec minio mc ls --versions local/vigiliobucket/foto.jpg

# 2. Restaurar una versión específica (copiándola sobre la actual)
docker exec minio mc cp --version-id "UUID-DE-LA-VERSION" local/vigiliobucket/foto.jpg local/vigiliobucket/foto.jpg
```

### 🧹 Limpieza Automática (Ahorrar Espacio)

Para evitar que el disco se llene con versiones viejas, configuramos una regla para borrarlas después de **2 semanas (14 días)**.

```bash
# Borrar versiones antiguas después de 14 días
docker exec minio mc ilm add --noncurrent-expire-days 14 local/vigiliobucket
```

```bash
# Borrar versiones antiguas después de 14 días
docker exec minio mc ilm add --noncurrent-expire-days 14 local/vigiliobucket
```

### ⚠️ Importante: Alta Concurrencia y Versionado

El versionado **SOLO** crea nuevas versiones si **sobrescribes** el mismo archivo (mismo nombre).

-   ✅ **1000 usuarios suben 1000 fotos distintas:** Se crean 1000 objetos (v1). **No hay basura extra.**
-   ❌ **1 usuario actualiza su foto 1000 veces:** Se crea 1 objeto con 1000 versiones. **Esto sí llena el disco.**

**Recomendación:** Si tienes archivos que cambian muy rápido (ej. logs, estados en tiempo real), usa un bucket **SIN versionado** o usa Redis.

## 🔧 MinIO Distribuido: Transparente para tus Proyectos

### Cómo MinIO Lee Nuevos Servidores

**Comando en docker-compose.yml:**

```yaml
command: server http://minio{1...8}/data{1...2}
#                         ↑↑↑↑↑↑↑↑↑
#                    Expansión automática
```

**MinIO expande esto a:**

```
http://minio1/data1
http://minio1/data2
http://minio2/data1
http://minio2/data2
http://minio3/data1
http://minio3/data2
http://minio4/data1
http://minio4/data2
http://minio5/data1  ← NUEVO
http://minio5/data2  ← NUEVO
http://minio6/data1  ← NUEVO
http://minio6/data2  ← NUEVO
http://minio7/data1  ← NUEVO
http://minio7/data2  ← NUEVO
http://minio8/data1  ← NUEVO
http://minio8/data2  ← NUEVO
```

**Todos los nodos tienen el MISMO comando:**

-   Se descubren automáticamente
-   Se comunican entre sí
-   Distribuyen datos automáticamente

### Tus Proyectos NO Cambian

```javascript
// Antes (4 nodos)
const minioClient = new Minio.Client({
    endPoint: "minio1",
    // ...
});

// Después (8 nodos)
const minioClient = new Minio.Client({
    endPoint: "minio1", // ← MISMA URL
    // ...
});

// MinIO maneja la distribución internamente
// Tú no necesitas cambiar nada
```

## 📊 Escalamiento de MinIO

### Regla: Múltiplos de 4

MinIO requiere agregar nodos en grupos de 4:

```
✅ 4 nodos → 8 nodos (agregar 4)
✅ 8 nodos → 12 nodos (agregar 4)
✅ 12 nodos → 16 nodos (agregar 4)

❌ 4 nodos → 5 nodos (NO permitido)
❌ 4 nodos → 6 nodos (NO permitido)
❌ 4 nodos → 7 nodos (NO permitido)
```

### Proceso de Escalamiento

Para ver la guía detallada de cómo escalar de 4 a 8 nodos en Docker Swarm, consulta:
👉 **[Guía de Escalamiento (SCALING.md)](SCALING.md)**

## 🎯 Beneficios del Almacenamiento Centralizado

### 1. Gestión Centralizada

-   ✅ Un solo lugar para backups
-   ✅ Una sola configuración de seguridad
-   ✅ Un solo monitoreo
-   ✅ Políticas centralizadas

### 2. Eficiencia

-   ✅ Mejor uso de recursos
-   ✅ Deduplicación posible
-   ✅ Caché compartido
-   ✅ Menos overhead

### 3. Escalabilidad

-   ✅ Escala una vez, todos se benefician
-   ✅ Más fácil de gestionar
-   ✅ Más económico

### 4. Simplicidad

-   ✅ Misma configuración para todos
-   ✅ Mismo SDK
-   ✅ Mismas credenciales (o por bucket)
-   ✅ Menos complejidad

## 💡 Mejores Prácticas

### 1. Nomenclatura de Buckets

```javascript
// Usa prefijos por proyecto
"proyecto1-uploads";
"proyecto1-media";
"proyecto2-documents";
"proyecto2-images";
"proyecto3-files";
```

### 2. Políticas por Bucket

```javascript
// Diferentes políticas por proyecto
await minioClient.setBucketPolicy("proyecto1-uploads", publicReadPolicy);
await minioClient.setBucketPolicy("proyecto2-documents", privatePolicy);
```

### 3. Usuarios por Proyecto (Opcional)

```bash
# Crear usuario específico por proyecto
mc admin user add myminio proyecto1-user password123
mc admin policy attach myminio readwrite --user proyecto1-user
```

### 4. Monitoreo Centralizado

```
Un solo dashboard de Grafana:
├── Storage total: 45GB
├── Requests/s: 1200
├── Por bucket:
│   ├── proyecto1-uploads: 15GB
│   ├── proyecto2-media: 20GB
│   └── proyecto3-files: 10GB
```

## 🎓 Resumen

**MinIO como almacenamiento centralizado:**

-   ✅ Un servidor para todos los proyectos
-   ✅ Misma URL para todos
-   ✅ Separación por buckets
-   ✅ Escalamiento centralizado
-   ✅ Gestión simplificada
-   ✅ Más económico

**Tus proyectos:**

-   ✅ Todos usan `endPoint: 'minio'`
-   ✅ Cada uno su propio bucket
-   ✅ MinIO maneja distribución internamente
-   ✅ Transparente para tus apps

**Escalamiento:**

-   ✅ Agregar en grupos de 4 nodos
-   ✅ O escalar verticalmente
-   ✅ Tus apps no cambian
-   ✅ MinIO redistribuye automáticamente

---

**Es como tener un disco duro compartido S3-compatible para todos tus proyectos, pero escalable.**
