import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as minio from "minio";
import { Enviroments } from "~/config/server/environments.config";

export const MINIO_CLIENT = Symbol("MINIO_CLIENT");

export const MinioProvider: Provider = {
    provide: MINIO_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<Enviroments>) =>
        new minio.Client({
            endPoint: configService.get("MINIO_ENDPOINT", "localhost:9000"),
            port: configService.get("MINIO_PORT"),
            useSSL: configService.get("NODE_ENV") === "production",
            accessKey: configService.get("MINIO_ACCESS_KEY"),
            secretKey: configService.get("MINIO_SECRET_KEY"),
            pathStyle: true, // REQUIRED for MinIO
            region: configService.get("MINIO_REGION"),
        }),
};
