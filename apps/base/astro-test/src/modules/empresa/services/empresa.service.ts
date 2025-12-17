import type { UserAuth } from "@modules/users/schemas/user.schema";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { EmpresaUpdateDto } from "../dtos/empresa.dto";
import { EmpresaRepository } from "../repositories/empresa.repository";
import type { EmpresaSchemaFromServer } from "../schemas/empresa.schema";

@Injectable()
export class EmpresaService {
    constructor(
        private readonly empresaRepository: EmpresaRepository,
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

    async update(
        user: UserAuth,
        empresa: EmpresaSchemaFromServer,
        body: EmpresaUpdateDto
    ) {
        await this.empresaRepository.update(empresa.id, user.id, body);

        await this.cache.delete("empresa");
        return {
            success: true,
            message: "Empresa actualizada correctamente",
        };
    }
}
