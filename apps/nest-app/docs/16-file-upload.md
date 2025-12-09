# 📁 Subida de Archivos (File Upload)

NestJS usa **Multer** por debajo (el estándar de Express) para manejar `multipart/form-data`.

## 📦 Setup

Necesitas los tipos:

```bash
npm install -D @types/multer
```

## 📤 Subiendo un archivo simple

Usa el `FileInterceptor` en tu controlador.

```typescript
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo en el form-data
uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log(file);
  return { filename: file.filename };
}
```

## ⚙️ Configuración (Validación y Destino)

Puedes configurar dónde se guarda (Disco o Memoria) y validar tipos.

```typescript
@UseInterceptors(FileInterceptor('file', {
  dest: './uploads', // Carpeta destino
  limits: { fileSize: 1024 * 1024 * 5 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Solo imágenes!'), false);
    }
    cb(null, true);
  },
}))
```

> [!WARNING]
> Para producción (AWS S3, Cloudinary), **no uses `dest` local**. Usa `MemoryStorage` y sube el buffer directamente a la nube en tu Servicio.

## 💡 Best Practices

1.  **Validación MimeType**: Nunca confíes en la extensión `.jpg`. Valida los "Magic Numbers" del archivo real si la seguridad es crítica, o al menos usa el `fileFilter` de Multer obligatoriamente.
2.  **Limitar Tamaño**: Siempre configura `limits.fileSize` parar evitar ataques DoS donde te envían un archivo de 10GB que llene tu memoria.
3.  **Procesamiento Async**: Si el usuario sube un video para convertir, no lo hagas en el Request. Sube el archivo, devuelve "OK", y usa una **Queue** (BullMQ) para procesarlo en background.

## ❓ FAQ: ¿Tengo que usar Multer a la fuerza? (vs Formidable/Busboy)

**Respuesta Corta:** Si usas **Express** (el default de NestJS), **sí**, Multer es la vía recomendada y "fácil".
NestJS trae envolturas (`FileInterceptor`) diseñadas específicamente para Multer.

**Si quieres usar Formidable:**

- Pierdes los decoradores `@UploadedFile()`.
- Tienes que manejar la `req` cruda manualmente dentro del Controller, perdiendo la elegancia del Framework.

**Alternativa (Fastify):**
Si la performance es crítica, usa el adaptador de **Fastify**. Fastify usa `busboy` por debajo (via `@fastify/multipart`), que es infinitamente más rápido que Multer/Formidable para streams de alta velocidad.
