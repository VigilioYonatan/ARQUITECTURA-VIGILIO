import { Module } from "@nestjs/common";
import { EmpresaRepository } from "../repositories/empresa.repository";
import { EmpresaService } from "../services/empresa.service";

@Module({
    providers: [EmpresaService, EmpresaRepository],
    exports: [EmpresaService],
})
export class EmpresaModule {}
