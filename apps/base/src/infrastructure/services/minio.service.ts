import type { Enviroments } from "@infrastructure/config/server/environments.config";
import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { MINIO_CLIENT } from "../providers/minio.provider";

const PART_SIZE = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class MinioService {
    private readonly bucket: string;
    constructor(
        @Inject(MINIO_CLIENT) private readonly client: Minio.Client,
        private readonly config: ConfigService<Enviroments>
    ) {
        this.bucket = this.config.get("MINIO_BUCKET", "uploads");
        this.ensureBucket();
    }

    private async ensureBucket() {
        const ok = await this.client.bucketExists(this.bucket);
        if (!ok) await this.client.makeBucket(this.bucket, "us-east-1");
    }

    /* 1. Iniciar multipart upload y devolver presigned urls */
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

    /* 2. Finalizar multipart */
    async completeMultipartUpload(
        uploadId: string,
        key: string,
        parts: { etag: string; part: number }[]
    ) {
        /* MinIO requiere que le pasemos el XML de CompleteMultipartUpload
       exactamente igual que S3. Con el cliente de MinIO lo hacemos
       mediante el método "completeMultipartUpload" nativo. */
        await this.client.completeMultipartUpload(
            this.bucket,
            key,
            uploadId,
            parts
        );
        return { success: true };
    }

    /* 3. Abortar multipart */
    async abortMultipartUpload(uploadId: string, key: string) {
        await this.client.abortMultipartUpload(this.bucket, key, uploadId);
        return { success: true };
    }
}
