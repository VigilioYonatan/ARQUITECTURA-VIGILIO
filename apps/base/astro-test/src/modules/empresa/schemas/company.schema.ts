import { z } from "@infrastructure/config/zod-i18n.config";
import { RUC_REGEX } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/schemas/upload.schema";

export const companySchema = z.object({
    id: z.number(),
    ruc: z.string().trim().regex(RUC_REGEX, "Ruc no válido"),
    razon_social: z
        .string()
        .trim()
        .min(3, "Este campo permite como mínimo 3 caracteres"),
    nombre_comercial: z
        .string()
        .trim()
        .min(3, "Este campo permite como mínimo 3 caracteres"),
    sol_user: z.string().trim(),
    sol_pass: z.string().trim(),
    // only guia de remision
    client_id: z.string().nullable(),
    client_secret: z.string().nullable(),
    certificado_password: z.string().nullable(),
    mode: z.union([z.literal("development"), z.literal("production")]),
    logo_facturacion: z.array(filesSchema([300])).nullable(),
    certificado_digital: z.array(filesSchema()).nullable(),
    empresa_id: z.number(),
});
export type CompanySchema = z.infer<typeof companySchema>;
