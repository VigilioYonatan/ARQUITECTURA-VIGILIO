import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class StorageService implements OnModuleInit {
    private minioClient: Minio.Client;
    private bucket: string;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.bucket = this.configService.get<string>("minio.bucket");
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>("minio.endpoint"),
            port: this.configService.get<number>("minio.port"),
            useSSL: this.configService.get<boolean>("minio.useSSL"),
            accessKey: this.configService.get<string>("minio.accessKey"),
            secretKey: this.configService.get<string>("minio.secretKey"),
        });
    }

    async uploadFile(
        filename: string,
        file: Buffer | import("stream").Readable,
        mimetype: string,
        size?: number
    ) {
        // Ensure bucket exists
        const bucketExists = await this.minioClient.bucketExists(this.bucket);
        if (!bucketExists) {
            await this.minioClient.makeBucket(this.bucket, "us-east-1");
        }

        await this.minioClient.putObject(
            this.bucket,
            filename,
            file,
            size, // Optional size, MinIO handles streams automatically
            {
                "Content-Type": mimetype,
            }
        );

        return {
            filename,
            url: `http://${this.configService.get(
                "minio.endpoint"
            )}:${this.configService.get("minio.port")}/${
                this.bucket
            }/${filename}`,
        };
    }

    async getFileUrl(filename: string) {
        return await this.minioClient.presignedGetObject(
            this.bucket,
            filename,
            24 * 60 * 60
        );
    }

    async moveFile(sourceObject: string, destObject: string) {
        const conds = new Minio.CopyConditions();
        await this.minioClient.copyObject(
            this.bucket,
            destObject,
            `/${this.bucket}/${sourceObject}`,
            conds
        );
        await this.minioClient.removeObject(this.bucket, sourceObject);

        return {
            url: `http://${this.configService.get(
                "minio.endpoint"
            )}:${this.configService.get("minio.port")}/${
                this.bucket
            }/${destObject}`,
        };
    }

    async deleteFile(filename: string) {
        await this.minioClient.removeObject(this.bucket, filename);
    }
}
