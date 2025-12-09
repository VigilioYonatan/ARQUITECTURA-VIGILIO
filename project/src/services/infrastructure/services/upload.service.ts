import { randomUUID } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Fields, Files, IncomingForm } from "formidable";
import * as Minio from "minio";
import sharp from "sharp";
import { Enviroments } from "~/config/server/environments.config";
import { MINIO_CLIENT } from "../providers/minio.provider";

@Injectable()
export class UploadService {
    private bucket: string;
    constructor(
        @Inject(MINIO_CLIENT) private minio: Minio.Client,
        private readonly config: ConfigService<Enviroments>
    ) {
        this.bucket = this.config.get("MINIO_BUCKET") || "processed";
    }

    async uploadFormidable(
        req: Request
    ): Promise<{ fileName: string; url: string }> {
        const form = new IncomingForm({ keepExtensions: true });
        type ParseResult = { fields: Fields; files: Files };
        const { files } = await new Promise<ParseResult>((resolve, reject) =>
            form.parse(req, (err, fields, files) =>
                err ? reject(err) : resolve({ fields, files })
            )
        );
        const uploadedFile = Array.isArray(files.file)
            ? files.file[0]
            : files.file;
        if (!uploadedFile) throw new Error("No file received");

        // 2. Leer y procesar con Sharp
        const processed = await sharp(uploadedFile.filepath)
            .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();

        // 3. Subir a MinIO
        const fileName = `${randomUUID()}.webp`;
        await this.minio.putObject(
            this.bucket,
            fileName,
            processed,
            processed.length,
            { "Content-Type": "image/webp" }
        );

        // 4. Generar URL firmada (24 h)
        const url = await this.minio.presignedUrl(
            "GET",
            this.bucket,
            fileName,
            24 * 60 * 60
        );
        return { fileName, url };
    }
}
