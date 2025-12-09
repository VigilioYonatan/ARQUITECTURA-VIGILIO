import { MinioService } from "@infrastructure/providers/storage/minio.service";
import { Module } from "@nestjs/common";
import { FileController } from "../controllers/file.controller";
import { FileService } from "../services/file.service";

@Module({
    imports: [MinioService],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule {}
