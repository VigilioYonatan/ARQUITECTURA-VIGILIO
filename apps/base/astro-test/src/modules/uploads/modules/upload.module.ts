import { AppConfigModule } from "@infrastructure/modules/config.module";
import { MinioModule } from "@infrastructure/providers/storage/minio.module";
import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
    imports: [MinioModule, AppConfigModule],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
