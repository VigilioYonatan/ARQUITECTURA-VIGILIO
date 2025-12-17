import { z } from "@infrastructure/config/zod-i18n.config";
import { COLOR_REGEX } from "@infrastructure/libs";
import type { UserCreated } from "@modules/users";

export const empresaSchema = z.object({
    id: z.number(),
    name_empresa: z.string().min(3).max(200),
    dial_code: z.string(),
    model_ai_groq: z.string().min(3).max(100),
    token_ai: z.string().min(4),
    color_primary: z.string().regex(COLOR_REGEX),
    timezone: z.string().min(3).max(100),
    enabled_automatic_payment: z.boolean(),
    enabled_send_sunat: z.boolean(),
    enabled_send_pdf: z.boolean(),
    telefono: z.string().min(9).max(9),
    address_id: z.number(),
    user_id: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});
export type EmpresaSchema = z.infer<typeof empresaSchema>;

export type EmpresaSchemaFromServer = EmpresaSchema & {
    user: UserCreated;
    // company: CompanySchema;
    // address: AddressSchemaFromServer;
};
