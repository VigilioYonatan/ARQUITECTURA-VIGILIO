import { RustFSModule } from "@infrastructure/providers/storage/rustfs.module";
import { Module } from "@nestjs/common";
import { FileRepository } from "../repositories/file.repository";
import { FileService } from "../services/file.service";

@Module({
    imports: [RustFSModule],
    controllers: [],
    providers: [FileService, FileRepository],
    exports: [],
})
export class FileModule {}
