import { MinioService } from "@infrastructure/providers/storage/minio.service";
import { Module } from "@nestjs/common";
import { FileService } from "../services/file.service";

@Module({
    imports: [MinioService],
    controllers: [],
    providers: [FileService],
    exports: [],
})
export class FileModule {}
