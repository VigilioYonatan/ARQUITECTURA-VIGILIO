# MinIO - Subida de Archivos con Presigned URLs (Mejor Práctica)

## 🎯 Por Qué Esta es la Mejor Opción

**Ventajas:**

-   ✅ Archivos NO pasan por tu servidor backend
-   ✅ Tu servidor solo genera URLs (~1KB)
-   ✅ Subida directa cliente → MinIO
-   ✅ Soporta archivos de cualquier tamaño
-   ✅ Progreso granular
-   ✅ Pausar/reanudar posible
-   ✅ Escala infinitamente

## 📦 Backend (Node.js + Express)

### Instalación

```bash
npm install minio express cors
```

### Configuración

```javascript
// config/minio.js
import * as Minio from "minio";

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "admin",
    secretKey: process.env.MINIO_SECRET_KEY || "your-password",
});

export const BUCKET_NAME = "uploads";
```

### API Endpoints

```javascript
// routes/upload.js
import express from "express";
import { minioClient, BUCKET_NAME } from "../config/minio.js";

const router = express.Router();

// 1. Iniciar multipart upload
router.post("/init-upload", async (req, res) => {
    try {
        const { filename, fileSize } = req.body;

        // Calcular número de partes (100MB por parte)
        const partSize = 100 * 1024 * 1024; // 100MB
        const numParts = Math.ceil(fileSize / partSize);

        // Iniciar multipart upload
        const uploadId = await minioClient.initiateNewMultipartUpload(
            BUCKET_NAME,
            filename
        );

        // Generar URLs firmadas para cada parte
        const partUrls = [];
        for (let i = 1; i <= numParts; i++) {
            const url = await minioClient.presignedUrl(
                "PUT",
                BUCKET_NAME,
                `${filename}?uploadId=${uploadId}&partNumber=${i}`,
                3600 // Válida por 1 hora
            );
            partUrls.push({ partNumber: i, url });
        }

        res.json({
            uploadId,
            partUrls,
            partSize,
        });
    } catch (error) {
        console.error("Error iniciando upload:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Completar multipart upload
router.post("/complete-upload", async (req, res) => {
    try {
        const { uploadId, filename, parts } = req.body;

        // Completar upload
        await minioClient.completeMultipartUpload(
            BUCKET_NAME,
            filename,
            uploadId,
            parts
        );

        res.json({
            success: true,
            url: `http://localhost:9000/${BUCKET_NAME}/${filename}`,
        });
    } catch (error) {
        console.error("Error completando upload:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Cancelar upload (opcional)
router.post("/abort-upload", async (req, res) => {
    try {
        const { uploadId, filename } = req.body;

        await minioClient.abortMultipartUpload(BUCKET_NAME, filename, uploadId);

        res.json({ success: true });
    } catch (error) {
        console.error("Error cancelando upload:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Generar URL de descarga
router.get("/download-url/:filename", async (req, res) => {
    try {
        const url = await minioClient.presignedGetObject(
            BUCKET_NAME,
            req.params.filename,
            3600 // Válida por 1 hora
        );

        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
```

### Server Principal

```javascript
// server.js
import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import { minioClient, BUCKET_NAME } from "./config/minio.js";

const app = express();

app.use(cors());
app.use(express.json());

// Crear bucket si no existe
const initBucket = async () => {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME);
        console.log(`✅ Bucket '${BUCKET_NAME}' creado`);
    }
};

initBucket();

// Routes
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🌐 Frontend (JavaScript Vanilla)

### HTML

```html
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <title>Upload a MinIO</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
            }
            .upload-container {
                border: 2px dashed #ccc;
                padding: 40px;
                text-align: center;
                border-radius: 8px;
            }
            .progress-bar {
                width: 100%;
                height: 30px;
                background: #f0f0f0;
                border-radius: 15px;
                overflow: hidden;
                margin: 20px 0;
                display: none;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4caf50, #45a049);
                width: 0%;
                transition: width 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            button {
                background: #4caf50;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background: #45a049;
            }
            button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        </style>
    </head>
    <body>
        <div class="upload-container">
            <h2>Subir Archivo a MinIO</h2>
            <input type="file" id="fileInput" />
            <button id="uploadBtn">Subir Archivo</button>

            <div class="progress-bar" id="progressBar">
                <div class="progress-fill" id="progressFill">0%</div>
            </div>

            <div id="status"></div>
        </div>

        <script src="upload.js"></script>
    </body>
</html>
```

### JavaScript

```javascript
// upload.js
const API_URL = "http://localhost:3000/api/upload";

document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecciona un archivo");
        return;
    }

    await uploadFile(file);
});

async function uploadFile(file) {
    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const status = document.getElementById("status");
    const uploadBtn = document.getElementById("uploadBtn");

    try {
        uploadBtn.disabled = true;
        progressBar.style.display = "block";
        status.textContent = "Iniciando upload...";

        // 1. Iniciar multipart upload
        const initResponse = await fetch(`${API_URL}/init-upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filename: file.name,
                fileSize: file.size,
            }),
        });

        const { uploadId, partUrls, partSize } = await initResponse.json();

        // 2. Subir cada parte directamente a MinIO
        const parts = [];
        const totalParts = partUrls.length;

        for (let i = 0; i < totalParts; i++) {
            const start = i * partSize;
            const end = Math.min(start + partSize, file.size);
            const chunk = file.slice(start, end);

            status.textContent = `Subiendo parte ${i + 1} de ${totalParts}...`;

            // Subir directamente a MinIO (no pasa por backend)
            const response = await fetch(partUrls[i].url, {
                method: "PUT",
                body: chunk,
            });

            if (!response.ok) {
                throw new Error(`Error subiendo parte ${i + 1}`);
            }

            // Guardar ETag de la parte
            parts.push({
                partNumber: i + 1,
                etag: response.headers.get("ETag").replace(/"/g, ""),
            });

            // Actualizar progreso
            const progress = (((i + 1) / totalParts) * 100).toFixed(2);
            progressFill.style.width = `${progress}%`;
            progressFill.textContent = `${progress}%`;
        }

        // 3. Completar upload
        status.textContent = "Finalizando upload...";

        const completeResponse = await fetch(`${API_URL}/complete-upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uploadId,
                filename: file.name,
                parts,
            }),
        });

        const result = await completeResponse.json();

        status.textContent = `✅ Archivo subido exitosamente!`;
        console.log("URL del archivo:", result.url);
    } catch (error) {
        console.error("Error:", error);
        status.textContent = `❌ Error: ${error.message}`;
    } finally {
        uploadBtn.disabled = false;
    }
}
```

## 🎯 Ventajas de Esta Implementación

1. **Tu servidor backend:**

    - Solo genera URLs (~1KB por request)
    - No maneja archivos
    - No consume RAM/CPU para transferencias
    - Escala infinitamente

2. **Cliente:**

    - Sube directamente a MinIO
    - Progreso granular
    - Puede pausar/reanudar (implementable)
    - Rápido (sin intermediarios)

3. **MinIO:**
    - Recibe archivos directamente
    - Maneja multipart automáticamente
    - Optimizado para esto

## 📊 Flujo Completo

```
1. Cliente → Backend: "Quiero subir archivo.zip (1GB)"
2. Backend → Cliente: "Aquí están 10 URLs firmadas"
3. Cliente → MinIO: Sube parte 1 (100MB) directamente
4. Cliente → MinIO: Sube parte 2 (100MB) directamente
   ... (repite para todas las partes)
5. Cliente → Backend: "Terminé, aquí están los ETags"
6. Backend → MinIO: "Completa el upload"
7. MinIO: Ensambla las partes
8. Backend → Cliente: "✅ Listo!"
```

## 🚀 Para Producción

Agrega:

-   Validación de tipos de archivo
-   Límites de tamaño
-   Autenticación/autorización
-   Retry logic en cliente
-   Cleanup de uploads incompletos
-   Escaneo de virus (background)

---

**Esta es la mejor práctica para subidas a MinIO. Tu servidor nunca maneja los archivos.**
