import type { Enviroments } from "@infrastructure/config/server/environments.config";
import type { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as minio from "minio";

export const MINIO_CLIENT = Symbol("MINIO_CLIENT");

export const MinioProvider: Provider = {
    provide: MINIO_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<Enviroments>) => {
        return new minio.Client({
            endPoint: configService.get("MINIO_ENDPOINT")!,
            port: configService.get("MINIO_PORT"),
            useSSL: configService.get("NODE_ENV") === "production",
            accessKey: configService.get("MINIO_ROOT_USER"),
            secretKey: configService.get("MINIO_ROOT_PASSWORD"),
            pathStyle: true, // REQUIRED for MinIO
            region: configService.get("MINIO_REGION"),
        });
    },
};
