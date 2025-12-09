import { Module } from "@nestjs/common";
import { MINIO_CLIENT, MinioProvider } from "../providers/minio.provider";
import { MinioService } from "../services/minio.service";
import { AppConfigModule } from "./config.module";

@Module({
    imports: [AppConfigModule],
    providers: [MinioProvider, MinioService],
    exports: [MinioService, MINIO_CLIENT],
})
export class MinioModule {}
