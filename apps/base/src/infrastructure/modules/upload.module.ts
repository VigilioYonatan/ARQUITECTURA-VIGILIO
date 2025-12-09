import { Module } from "@nestjs/common";
import { UploadController } from "../controllers/upload.controller";
import { UploadService } from "../services/upload.service";
import { AppConfigModule } from "./config.module";
import { MinioModule } from "./minio.module";

@Module({
    imports: [MinioModule, AppConfigModule],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
