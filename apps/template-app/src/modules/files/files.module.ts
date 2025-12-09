import { Module } from "@nestjs/common";
import { FilesController } from "./controllers/files.controller";
import { FilesService } from "./services/files.service";
import { TusService } from "./services/tus.service";
import { TusController } from "./controllers/tus.controller";

@Module({
    controllers: [FilesController, TusController],
    providers: [FilesService, TusService],
})
export class FilesModule {}
