import type { UserAuth } from "@modules/user/schemas/user.schema";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { EmpresaUpdateDto } from "../dtos/empresa.dto";
import type { EmpresaEntity } from "../entities/empresa.entity";
import { EMPRESA_REPOSITORY } from "../providers/empresa.provider";
import type { EmpresaSchemaFromServer } from "../schemas/empresa.schema";

@Injectable()
export class EmpresaService {
    constructor(
        @Inject(EMPRESA_REPOSITORY)
        private readonly empresaRepository: EmpresaEntity,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache
    ) {}

    async update(
        user: UserAuth,
        empresa: EmpresaSchemaFromServer,
        body: EmpresaUpdateDto
    ) {
        await this.empresaRepository.update(
            { ...body, user_id: user.id },
            {
                where: {
                    id: empresa.id,
                },
            }
        );
        await this.cache.del("empresa");
        return {
            success: true,
            message: "Empresa actualizada correctamente",
        };
    }
}
