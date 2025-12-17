import { Module } from "@nestjs/common";
import { IconController } from "../controllers/icon.controller";
import { EmpresaRepository } from "../repositories/empresa.repository";
import { IconRepository } from "../repositories/icon.repository";
import { EmpresaService } from "../services/empresa.service";
import { IconService } from "../services/icon.service";

@Module({
    controllers: [IconController],
    providers: [EmpresaService, EmpresaRepository, IconService, IconRepository],
    exports: [EmpresaService, IconService],
})
export class EmpresaModule {}
