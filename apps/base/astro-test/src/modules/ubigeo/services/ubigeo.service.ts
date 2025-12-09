import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { CacheService } from "@infrastructure/providers/cache/cache.service";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema"; // Importa tu schema tipado
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { eq } from "drizzle-orm"; // Operador de Drizzle
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { CountryRelations } from "../entities/country.entity";

@Injectable()
export class UbigeoService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly cacheService: CacheService
    ) {}

    async index() {
        let data =
            await this.cacheService.cacheGetJson<CountryRelations | null>(
                "ubigeo"
            );

        if (!data) {
            data = (await this.db.query.country.findFirst({
                where: eq(schema.country.dial_code, "51"),
                with: {
                    regions: {
                        with: {
                            cities: true,
                        },
                    },
                },
            })) as CountryRelations;
            await this.cache.set(
                "ubigeo",
                JSON.stringify(data),
                cacheTimes.days30
            );
        }

        return {
            success: true,
            data,
        };
    }
}
