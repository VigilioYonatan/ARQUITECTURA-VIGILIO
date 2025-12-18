import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable } from "@nestjs/common";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { AddressSchema } from "../schemas/address.schema";

@Injectable()
export class AddressSeeder {
    private readonly addressSeed: Omit<AddressSchema, "id"> = {
        ubigeo: "150101",
        urbanizacion: "Urbanizacion",
        direccion: "Direccion",
        cod_local: "CodLocal",
        city_id: 1,
        user_id: 1,
    };
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}
    async run() {
        await this.db
            .insert(schema.address)
            .values(this.addressSeed)
            .returning();
    }
}
