import { AppConfigModule } from "@infrastructure/modules/config.module";
import { RustFSModule } from "@infrastructure/providers/storage/rustfs.module";
import { Module } from "@nestjs/common";
import { UploadController } from "../controllers/upload.controller";
import { UploadService } from "../services/upload.service";

@Module({
    imports: [AppConfigModule, RustFSModule],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
