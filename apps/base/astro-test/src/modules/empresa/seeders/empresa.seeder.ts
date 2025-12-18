import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable } from "@nestjs/common";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { EmpresaSchema } from "../schemas/empresa.schema";

@Injectable()
export class EmpresaSeeder {
    private readonly empresaSeed: Omit<EmpresaSchema, "id"> = {
        name_empresa: "Yonatan Vigilio",
        dial_code: "+51",
        model_ai_groq: "gpt-4o",
        token_ai: "sk-proj-",
        color_primary: "#000000",
        timezone: "America/Lima",
        enabled_automatic_payment: false,
        enabled_send_sunat: false,
        enabled_send_pdf: false,
        telefono: "987654321",
        address_id: 1,
        user_id: 1,
        logo_facturacion: null,
        certificado_digital: null,
    };
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}
    async run() {
        await this.db
            .insert(schema.empresa)
            .values(this.empresaSeed)
            .returning();
    }
}
