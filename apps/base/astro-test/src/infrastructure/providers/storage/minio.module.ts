import { Module } from "@nestjs/common";
import { AppConfigModule } from "../../modules/config.module";
import { MINIO_CLIENT, MinioProvider } from "./minio.provider";
import { MinioService } from "./minio.service";

@Module({
    imports: [AppConfigModule],
    providers: [MinioProvider, MinioService],
    exports: [MinioService, MINIO_CLIENT],
})
export class MinioModule {}
