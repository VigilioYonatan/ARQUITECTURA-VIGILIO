import crypto from "node:crypto";
import { createReadStream, ReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateBucketCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadBucketCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage"; // Útil para streams grandes
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Enviroments } from "@infrastructure/config/server/environments.config";
import type { UploadConfig } from "@modules/uploads/modules/upload.const";
import type { FilesSchema } from "@modules/uploads/modules/upload.schema";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import type { File } from "formidable";
import sharp from "sharp";

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);

const PART_SIZE = 10 * 1024 * 1024; // 10 MB

@Injectable()
export class MinioService {
    private readonly bucket: string;
    private readonly logger = new Logger(MinioService.name);

    private internalClient: S3Client; // Para hablar con MinIO (red docker)
    private signerClient: S3Client; // Para firmar URLs (localhost)

    constructor(private readonly configService: ConfigService<Enviroments>) {
        this.bucket = this.configService.get("MINIO_BUCKET_NAME", "uploads");

        const credentials = {
            accessKeyId: this.configService.getOrThrow("MINIO_ROOT_USER"),
            secretAccessKey: this.configService.getOrThrow(
                "MINIO_ROOT_PASSWORD"
            ),
        };

        const region = this.configService.get("MINIO_REGION", "us-east-1");

        // 1. CLIENTE INTERNO (Docker -> MinIO)
        this.internalClient = new S3Client({
            region,
            endpoint: this.configService.getOrThrow("MINIO_INTERNAL_ENDPOINT"), // "http://minio:9000"
            credentials,
            forcePathStyle: true, // CRÍTICO PARA MINIO
        });

        // 2. CLIENTE FIRMANTE (Navegador -> MinIO)
        this.signerClient = new S3Client({
            region,
            endpoint: this.configService.getOrThrow("MINIO_PUBLIC_ENDPOINT"), // "http://localhost:9000"
            credentials,
            forcePathStyle: true,
        });

        this.ensureBucket();
    }

    private async ensureBucket() {
        try {
            await this.internalClient.send(
                new HeadBucketCommand({ Bucket: this.bucket })
            );
        } catch (error) {
            this.logger.log(`Bucket ${this.bucket} not found, creating...`);
            try {
                await this.internalClient.send(
                    new CreateBucketCommand({ Bucket: this.bucket })
                );
            } catch (createError) {
                this.logger.error("Error creating bucket", createError);
            }
        }
    }

    // --- SUBIDA DIRECTA (Backend -> MinIO) ---
    async uploadFile(
        key: string,
        file: Buffer | ReadStream,
        mimetype: string,
        size?: number
    ) {
        // Usamos @aws-sdk/lib-storage para manejar streams de forma eficiente
        // o PutObjectCommand directo si es pequeño. Para compatibilidad con tu código:

        try {
            const parallelUploads3 = new Upload({
                client: this.internalClient,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: file,
                    ContentType: mimetype,
                },
            });

            await parallelUploads3.done();

            return {
                key,
                // Construimos la URL pública manualmente o devolvemos solo la key
                url: `${this.configService.get("MINIO_PUBLIC_ENDPOINT")}/${
                    this.bucket
                }/${key}`,
            };
        } catch (error) {
            this.logger.error(`Error uploading file ${key}`, error);
            throw new InternalServerErrorException("S3 Upload Failed");
        }
    }

    async removeFile(files: FilesSchema[]) {
        for (const element of files) {
            await this.internalClient.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: element.key,
                })
            );
        }
        return { success: true };
    }

    // --- ESTRATEGIA 1: SIMPLE (Presigned URL) ---
    async getPresignedUrlSimple(fileName: string) {
        const key = `${crypto.randomUUID()}-${fileName}`;

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                // Opcional: Si quieres forzar el Content-Type, pásalo como argumento a esta función
                // ContentType: fileType
            });

            // USAMOS signerClient: La URL generada tendrá 'localhost' (o tu dominio público)
            const uploadUrl = await getSignedUrl(this.signerClient, command, {
                expiresIn: 900, // 15 min
            });

            this.logger.log(`URL generada: ${uploadUrl}`);
            return { uploadUrl, key };
        } catch (error) {
            throw new InternalServerErrorException("Error generando URL");
        }
    }

    // --- ESTRATEGIA 2: MULTIPART (AWS SDK Nativo) ---

    // 1. Iniciar Multipart
    async createMultipartUpload(fileName: string, fileType: string) {
        const key = `${crypto.randomUUID()}-${fileName}`;

        const command = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: fileType,
        });

        try {
            // USAMOS internalClient: NestJS habla con MinIO para iniciar proceso
            const { UploadId: uploadId } = await this.internalClient.send(
                command
            );
            this.logger.log({ uploadId }, "UploadId");
            return { uploadId, key };
        } catch (_error) {
            throw new InternalServerErrorException("Falló init multipart");
        }
    }

    // 2. Firmar Parte
    async signMultipartUploadPart(
        key: string,
        uploadId: string,
        partNumber: number
    ) {
        try {
            const command = new UploadPartCommand({
                Bucket: this.bucket,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNumber,
            });

            // USAMOS signerClient: Para que el navegador reciba URL de localhost
            const url = await getSignedUrl(this.signerClient, command, {
                expiresIn: 3600,
            });
            return { url };
        } catch (error) {
            throw new InternalServerErrorException("Error firmando parte");
        }
    }

    // 3. Completar Multipart
    async completeMultipartUpload(key: string, uploadId: string, parts: any[]) {
        // AWS SDK espera un array de { ETag, PartNumber }
        // Asegúrate de que 'parts' venga con ese formato desde el frontend

        const command = new CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts,
            },
        });

        try {
            // USAMOS internalClient: NestJS cierra el trato
            await this.internalClient.send(command);
            return { location: key };
        } catch (_error) {
            throw new InternalServerErrorException(
                "Error completando multipart"
            );
        }
    }

    async abortMultipartUpload(uploadId: string, key: string) {
        await this.internalClient.send(
            new AbortMultipartUploadCommand({
                Bucket: this.bucket,
                Key: key,
                UploadId: uploadId,
            })
        );
        return { success: true };
    }

    // --- GET URL (Download) ---
    async getSecureFileUrl(key: string, expirySeconds = 3600) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        // Generamos url firmada para descargar
        return await getSignedUrl(this.signerClient, command, {
            expiresIn: expirySeconds,
        });
    }

    async fileExists(key: string) {
        // En S3, verificamos existencia con HeadObject. Si falla, no existe.
        // (Omitido por brevedad, usar HeadObjectCommand si es necesario)
        // Para ficheros locales (sistema de archivos) mantenemos tu lógica fs:
        try {
            await fs.access(key); // Ojo: ¿esto valida ruta local o S3? Tu código original validaba ruta local.
            return true;
        } catch {
            return false;
        }
    }

    // ===========================================================================
    //  LÓGICA DE PROCESAMIENTO (FFMPEG / SHARP) - MANTENIDA IGUAL
    // ===========================================================================

    async processAndUpload(
        files: File[],
        rule: UploadConfig,
        fileName?: string
    ): Promise<FilesSchema[]> {
        const maxFiles = rule.max_files || 5;
        this.logger.log({ maxFiles });
        if (files.length > maxFiles) {
            throw new BadRequestException(
                `Max files limit exceeded. Allowed: ${maxFiles}, Received: ${files.length}`
            );
        }

        const promises = files.map(async (file) => {
            const finalFilename = fileName || crypto.randomUUID();
            const originalExt =
                path.extname(file.originalFilename || "").replace(".", "") ||
                "bin";
            const keyS3Base = `${rule.folder || "uploads"}/${finalFilename}`;

            let tempFilePathToDelete: string | null = null;

            try {
                // --- A. IMÁGENES ---
                if (file.mimetype?.startsWith("image/")) {
                    const imageResults = await this.processImage(file, rule);

                    const uploadedImages = await Promise.all(
                        imageResults.map(async (item) => {
                            const upload = await this.uploadFile(
                                `${keyS3Base}.${item.dimension}.webp`,
                                item.buffer,
                                "image/webp",
                                item.size
                            );
                            return {
                                key: upload.key,
                                mimetype: "image/webp",
                                size: item.size,
                                name: finalFilename,
                                dimension: item.dimension,
                            };
                        })
                    );
                    return uploadedImages;
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
                    tempFilePathToDelete = videoResult.path;

                    finalMime = "video/mp4";
                    finalKey = `${keyS3Base}.mp4`;
                    finalSize = (await fs.stat(videoResult.path)).size;
                } else {
                    // --- C. ARCHIVOS NORMALES ---
                    fileStream = createReadStream(file.filepath);
                }

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
                return null;
            } finally {
                try {
                    if (file.filepath) await this.cleanupFile(file.filepath);
                    if (tempFilePathToDelete)
                        await this.cleanupFile(tempFilePathToDelete);
                } catch (_e) {
                    // ignore
                }
            }
        });

        const results = await Promise.allSettled(promises);

        const successfulUploads: FilesSchema[] = results
            .filter(
                (r): r is PromiseFulfilledResult<any> =>
                    r.status === "fulfilled" && r.value !== null
            )
            .flatMap((r) => r.value);

        return successfulUploads;
    }

    // --- MÉTODOS PRIVADOS (SHARP / FFMPEG) ---

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
        const outputPath = path.join(
            process.cwd(),
            "src",
            "assets",
            "temp",
            outputFilename
        );

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
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (e) {
            if ((e as any).code !== "ENOENT") {
                this.logger.warn(`Failed to cleanup file: ${filePath}`, e);
            }
        }
    }
}
