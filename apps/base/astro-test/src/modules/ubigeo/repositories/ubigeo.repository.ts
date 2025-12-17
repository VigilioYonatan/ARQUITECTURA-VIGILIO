import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { CountryRelations } from "../entities/country.entity";

@Injectable()
export class UbigeoRepository {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async findPeruWithRegionsAndCities(): Promise<CountryRelations | null> {
        const result = await this.db.query.country.findFirst({
            where: eq(schema.country.dial_code, "51"),
            with: {
                regions: {
                    with: {
                        cities: true,
                    },
                },
            },
        });
        return (result as CountryRelations) || null;
    }
}
