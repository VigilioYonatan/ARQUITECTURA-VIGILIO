import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import type { UserAuth } from "@modules/user/schemas/user.schema";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { EmpresaUpdateDto } from "../dtos/empresa.dto";
import type { EmpresaSchemaFromServer } from "../schemas/empresa.schema";

@Injectable()
export class EmpresaService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

    async update(
        user: UserAuth,
        empresa: EmpresaSchemaFromServer,
        body: EmpresaUpdateDto
    ) {
        await this.db
            .update(schema.empresa)
            .set({
                ...body,
            })
            .where(eq(schema.empresa.id, empresa.id));

        await this.cache.delete("empresa");
        return {
            success: true,
            message: "Empresa actualizada correctamente",
        };
    }
}
