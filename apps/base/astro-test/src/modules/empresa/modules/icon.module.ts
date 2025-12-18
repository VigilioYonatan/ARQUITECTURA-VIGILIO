import { Module } from "@nestjs/common";
import { IconController } from "../controllers/icon.controller";
import { IconRepository } from "../repositories/icon.repository";
import { IconService } from "../services/icon.service";

@Module({
    controllers: [IconController],
    providers: [IconService, IconRepository],
    exports: [IconService],
})
export class IconModule {}
