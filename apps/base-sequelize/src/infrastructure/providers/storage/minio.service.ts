import crypto from "node:crypto";
import { createReadStream, ReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { Enviroments } from "@infrastructure/config/server/environments.config";
import { cacheTimes } from "@infrastructure/libs/server/helpers";
import type { UploadConfig } from "@modules/uploads/modules/upload.const";
import type { FilesSchema } from "@modules/uploads/modules/upload.schema";
import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import type { File } from "formidable";
import * as Minio from "minio";
import sharp from "sharp";
import { MINIO_CLIENT } from "./minio.provider";

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);

const PART_SIZE = 10 * 1024 * 1024; // 10 MB

@Injectable()
export class MinioService {
    private readonly bucket: string;
    private readonly logger = new Logger(MinioService.name);
    constructor(
        @Inject(MINIO_CLIENT) private readonly client: Minio.Client,
        private readonly configService: ConfigService<Enviroments>
    ) {
        this.bucket = this.configService.get("MINIO_BUCKET_NAME", "uploads");
        this.ensureBucket();
    }

    private async ensureBucket() {
        const ok = await this.client.bucketExists(this.bucket);
        if (!ok)
            await this.client.makeBucket(
                this.bucket,
                this.configService.get("MINIO_REGION")
            );
    }
    async uploadFile(
        key: string,
        file: Buffer | ReadStream,
        mimetype: string,
        size?: number
    ) {
        // Ensure bucket exists
        const bucketExists = await this.client.bucketExists(this.bucket);
        if (!bucketExists) {
            await this.client.makeBucket(
                this.bucket,
                this.configService.get("MINIO_REGION")
            );
        }

        await this.client.putObject(
            this.bucket,
            key,
            file,
            size, // Optional size, MinIO handles streams automatically
            {
                "Content-Type": mimetype,
            }
        );

        return {
            key,
            url: `http://${this.configService.get(
                "MINIO_ENDPOINT"
            )}:${this.configService.get("MINIO_PORT")}/${this.bucket}/${key}`,
        };
    }
    /* Iniciar multipart upload y devolver presigned urls */
    async startMultipartUpload(fileName: string, fileSize: number) {
        const objectName = `uploads/${Date.now()}-${fileName}`;
        const partCount = Math.ceil(fileSize / PART_SIZE);

        /* MinIO admite el mismo parámetro que S3: uploadId lo pasamos
       en el query-string cuando firmamos cada parte. Como no hay
       comando “CreateMultipartUpload” debemos generar nosotros un
       uploadId único que el front deberá re-utilizar. */
        const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // Re-firmamos con el uploadId correcto
        const presignedUrls = await Promise.all(
            Array.from({ length: partCount }, (_, i) =>
                this.client.presignedUrl(
                    "PUT",
                    this.bucket,
                    objectName,
                    cacheTimes.days1, //24 h
                    {
                        partNumber: String(i + 1),
                        uploadId,
                    }
                )
            )
        );

        return { success: true, uploadId, key: objectName, presignedUrls };
    }

    /* Finalizar multipart */
    async completeMultipartUpload(
        uploadId: string,
        key: string,
        parts: { etag: string; part: number }[]
    ) {
        await this.client.completeMultipartUpload(
            this.bucket,
            key,
            uploadId,
            parts
        );
        return { success: true };
    }

    async abortMultipartUpload(uploadId: string, key: string) {
        await this.client.abortMultipartUpload(this.bucket, key, uploadId);
        return { success: true };
    }

    async removeFile(file: FilesSchema[]) {
        for (const element of file) {
            await this.client.removeObject(this.bucket, element.key);
        }
        return { success: true };
    }

    // UPLOAD
    async processAndUpload(
        files: File[],
        rule: UploadConfig,
        fileName?: string
    ): Promise<FilesSchema[]> {
        // 1. Validación inicial
        const maxFiles = rule.max_files || 5;
        this.logger.log({ maxFiles });
        if (files.length > maxFiles) {
            throw new BadRequestException(
                `Max files limit exceeded. Allowed: ${maxFiles}, Received: ${files.length}`
            );
        }
        // 2. Procesamiento PARALELO (Mejora de Performance brutal)
        // Usamos map para crear un array de Promesas "Process & Upload"
        const promises = files.map(async (file) => {
            const finalFilename = fileName || crypto.randomUUID();
            // Truco: Usar la extensión original es más seguro que adivinarla del mimetype
            const originalExt =
                path.extname(file.originalFilename || "").replace(".", "") ||
                "bin";
            const keyS3Base = `${rule.folder || "uploads"}/${finalFilename}`;

            let tempFilePathToDelete: string | null = null;

            try {
                // --- A. IMÁGENES ---
                if (file.mimetype?.startsWith("image/")) {
                    const imageResults = await this.processImage(file, rule);

                    // Subimos las variantes de imagen (thumbnail, webp, etc)
                    const uploadedImages = await Promise.all(
                        imageResults.map(async (item) => {
                            const upload = await this.uploadFile(
                                `${keyS3Base}.${item.dimension}.webp`, // O logic para nombres unicos
                                item.buffer, // Buffer directo
                                "image/webp",
                                item.size
                            );
                            return {
                                key: upload.key, // Usar la key real que devuelve S3
                                mimetype: "image/webp",
                                size: item.size,
                                name: finalFilename,
                                dimension: item.dimension,
                            };
                        })
                    );
                    return uploadedImages; // Retorna array de resultados
                }

                // --- B. VIDEOS ---
                let fileStream: ReadStream;
                let finalMime = file.mimetype || "application/octet-stream";
                let finalSize = file.size;
                let finalKey = `${keyS3Base}.${originalExt}`;

                if (file.mimetype?.startsWith("video/")) {
                    const videoResult = await this.processVideo(
                        file,
                        finalFilename
                    );
                    fileStream = createReadStream(videoResult.path);
                    tempFilePathToDelete = videoResult.path; // Marcamos para borrar

                    finalMime = "video/mp4";
                    finalKey = `${keyS3Base}.mp4`;
                    finalSize = (await fs.stat(videoResult.path)).size; // Tamaño real post-proceso
                } else {
                    // --- C. ARCHIVOS NORMALES ---
                    fileStream = createReadStream(file.filepath);
                }

                // --- SUBIDA INMEDIATA ---
                // Subimos AHORA, mientras el archivo existe y el stream está fresco
                const uploadResult = await this.uploadFile(
                    finalKey,
                    fileStream,
                    finalMime,
                    finalSize
                );

                return [
                    {
                        key: uploadResult.key,
                        mimetype: finalMime,
                        size: finalSize,
                        name: finalFilename,
                    },
                ];
            } catch (error) {
                this.logger.error(
                    `Error processing/uploading ${file.originalFilename}`,
                    error
                );
                return null; // Retornamos null para filtrar fallos después
            } finally {
                // --- LIMPIEZA SEGURA ---
                // Ahora sí es seguro borrar, porque await uploadFile ya terminó
                try {
                    if (file.filepath) await this.cleanupFile(file.filepath);
                    if (tempFilePathToDelete)
                        await this.cleanupFile(tempFilePathToDelete);
                } catch (_e) {
                    // Ignorar errores de limpieza, no son críticos para el usuario
                }
            }
        });

        // 3. Esperar a que todo termine (Concurrencia)
        const results = await Promise.allSettled(promises);

        // 4. Aplanar y limpiar resultados
        // Filtramos los que fallaron (null) y aplanamos el array (porque imágenes devuelven arrays)
        const successfulUploads: FilesSchema[] = results
            .filter(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (r): r is PromiseFulfilledResult<any> =>
                    r.status === "fulfilled" && r.value !== null
            )
            .flatMap((r) => r.value);

        return successfulUploads;
    }

    // --- MÉTODOS PRIVADOS DE AYUDA ---

    private async processImage(
        file: File,
        rule: UploadConfig
    ): Promise<{ buffer: Buffer; size: number; dimension: number }[]> {
        const results: { buffer: Buffer; size: number; dimension: number }[] =
            [];
        for await (const dimension of rule?.dimensions || []) {
            try {
                const inputBuffer = await fs.readFile(file.filepath);
                let pipeline = sharp(inputBuffer);

                pipeline = pipeline.resize({
                    width: dimension,
                    withoutEnlargement: true,
                });

                const outputBuffer = await pipeline
                    .webp({ quality: 80 })
                    .toBuffer();
                results.push({
                    buffer: outputBuffer,
                    size: outputBuffer.length,
                    dimension,
                });
            } catch (error) {
                this.logger.warn(
                    "Image optimization failed, falling back to original",
                    error
                );
                // Si falla, leemos el original y lo devolvemos como buffer para mantener consistencia en este bloque
                const originalBuffer = await fs.readFile(file.filepath);
                results.push({
                    buffer: originalBuffer,
                    size: file.size,
                    dimension: file.size,
                });
            }
        }
        return results;
    }

    private async processVideo(
        file: File,
        baseName: string
    ): Promise<{ path: string; filename: string }> {
        this.logger.log({ file });
        const outputFilename = `${baseName.split(".")[0]}_optimized.mp4`;
        // Usamos path.join para evitar problemas de rutas en Windows/Linux
        const outputPath = path.join(
            process.cwd(),
            "src",
            "assets",
            "temp",
            outputFilename
        );

        // Aseguramos que la carpeta temp exista
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        return new Promise((resolve, reject) => {
            ffmpeg(file.filepath)
                .videoCodec("libx264")
                .addOption("-preset", "slow")
                .addOption("-crf", "26")
                .videoFilters(["scale='min(1280,iw)':-2"])
                .audioCodec("aac")
                .audioBitrate("128k")
                .audioChannels(2)
                .addOption("-movflags", "+faststart")
                .on("end", () => {
                    this.logger.log(`✅ Video optimized: ${outputFilename}`);
                    resolve({ path: outputPath, filename: outputFilename });
                })
                .on("error", (err) => {
                    this.logger.error("❌ FFmpeg Error:", err);
                    reject(err);
                })
                .save(outputPath);
        });
    }

    private async cleanupFile(filePath: string) {
        try {
            // Verificamos si existe antes de borrar para evitar errores
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (e) {
            // Ignoramos error si el archivo no existe, pero logueamos otros errores
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            if ((e as any).code !== "ENOENT") {
                this.logger.warn(`Failed to cleanup file: ${filePath}`, e);
            }
        }
    }

    async fileExists(path: string) {
        try {
            await fs.access(path);
            return true;
        } catch {
            return false;
        }
    }

    // GET URL
    async getSecureFileUrl(key: string, expirySeconds = 3600) {
        const internalUrl = await this.client.presignedGetObject(
            this.bucket,
            key,
            expirySeconds
        );
        const publicUrl = "http://minio:9000"; // ej: https://cdn.miweb.com

        // Reemplazamos el host interno por el público, manteniendo la firma y los tokens
        return internalUrl.replace(
            `http://${this.configService.get(
                "MINIO_ENDPOINT"
            )}:${this.configService.get("MINIO_PORT")}`,
            publicUrl
        );
    }

    //     proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

    // server {
    //     listen 80;
    //     server_name cdn.miweb.com;

    //     # 1. Configuración para Archivos Públicos (Avatars, Banners)
    //     # Acceso directo sin firma, con caché agresivo
    //     location /public/ {
    //         proxy_pass http://minio_container:9000/mi-bucket-publico/;

    //         # 🔥 CACHÉ DEL SERVIDOR (Nginx guarda una copia)
    //         proxy_cache my_cache;
    //         proxy_cache_valid 200 30d; # Si MinIO dice OK, guarda por 30 días

    //         # 🧠 CACHÉ DEL NAVEGADOR (El cliente guarda una copia)
    //         add_header Cache-Control "public, max-age=31536000, immutable";

    //         # Seguridad: Ocultar que usamos MinIO
    //         proxy_hide_header x-amz-request-id;
    //         proxy_hide_header Set-Cookie;
    //     }

    //     # 2. Configuración para Archivos Privados (Presigned URLs)
    //     # Aquí Nginx solo hace de túnel, respeta la firma de la URL
    //     location /private/ {
    //         proxy_pass http://minio_container:9000/mi-bucket-privado/;

    //         # No cacheamos en Nginx porque las URLs expiran
    //         proxy_buffering off;

    //         # Forzar descarga en lugar de ver en navegador (Opcional)
    //         # add_header Content-Disposition "attachment";
    //     }
    // }

    //     services:
    //   minio:
    //     image: minio/minio
    //     command: server /data --console-address ":9001"
    //     # ... tus volúmenes y enviroments ...
    //     labels:
    //       - "traefik.enable=true"

    //       # -----------------------------------------------------------
    //       # 1. ROUTER PARA ARCHIVOS PÚBLICOS (/public/ -> /mi-bucket-publico/)
    //       # -----------------------------------------------------------
    //       - "traefik.http.routers.minio-public.rule=Host(`cdn.miweb.com`) && PathPrefix(`/public`)"
    //       - "traefik.http.routers.minio-public.entrypoints=websecure"
    //       - "traefik.http.routers.minio-public.tls.certresolver=myresolver"
    //       # Aplicamos los middlewares en cadena: Reescribir ruta -> Headers Caché -> Headers Seguridad
    //       - "traefik.http.routers.minio-public.middlewares=minio-rewrite-public,minio-cache-headers,minio-security-headers"

    //       # MIDDLEWARE: Reescribir URL (Equivalente a proxy_pass con path diferente)
    //       # Transforma: cdn.miweb.com/public/foto.jpg  -->  minio:9000/mi-bucket-publico/foto.jpg
    //       - "traefik.http.middlewares.minio-rewrite-public.replacepathregex.regex=^/public/(.*)"
    //       - "traefik.http.middlewares.minio-rewrite-public.replacepathregex.replacement=/mi-bucket-publico/$$1"

    //       # MIDDLEWARE: Headers de Caché (Equivalente a add_header Cache-Control)
    //       # 🔥 ESTO ES LO QUE HACE QUE EL NAVEGADOR NO PIDA LA FOTO DE NUEVO
    //       - "traefik.http.middlewares.minio-cache-headers.headers.customresponseheaders.Cache-Control=public, max-age=31536000, immutable"

    //       # -----------------------------------------------------------
    //       # 2. ROUTER PARA ARCHIVOS PRIVADOS (/private/ -> /mi-bucket-privado/)
    //       # -----------------------------------------------------------
    //       - "traefik.http.routers.minio-private.rule=Host(`cdn.miweb.com`) && PathPrefix(`/private`)"
    //       - "traefik.http.routers.minio-private.entrypoints=websecure"
    //       - "traefik.http.routers.minio-private.tls.certresolver=myresolver"
    //       - "traefik.http.routers.minio-private.middlewares=minio-rewrite-private,minio-security-headers"

    //       # MIDDLEWARE: Reescribir URL Privada
    //       # Transforma: cdn.miweb.com/private/factura.pdf --> minio:9000/mi-bucket-privado/factura.pdf
    //       - "traefik.http.middlewares.minio-rewrite-private.replacepathregex.regex=^/private/(.*)"
    //       - "traefik.http.middlewares.minio-rewrite-private.replacepathregex.replacement=/mi-bucket-privado/$$1"

    //       # -----------------------------------------------------------
    //       # 3. SEGURIDAD GENERAL (Equivalente a proxy_hide_header)
    //       # -----------------------------------------------------------
    //       # Ocultamos headers de MinIO para que nadie sepa qué tecnología usas
    //       - "traefik.http.middlewares.minio-security-headers.headers.customresponseheaders.Server="
    //       - "traefik.http.middlewares.minio-security-headers.headers.customresponseheaders.X-Amz-Request-Id="
    //       - "traefik.http.middlewares.minio-security-headers.headers.customresponseheaders.Set-Cookie="
    //       # Forzar descarga en privados (Opcional, descomentar si quieres)
    //       # - "traefik.http.middlewares.minio-private-download.headers.customresponseheaders.Content-Disposition=attachment"

    //       # Conexión interna al puerto de API de MinIO (no la consola)
    //       - "traefik.http.services.minio.loadbalancer.server.port=9000"
}
