import { RUC_REGEX } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/modules/upload.schema";
import {
    array,
    type Input,
    literal,
    minLength,
    nullable,
    number,
    object,
    regex,
    string,
    toTrimmed,
    union,
} from "@vigilio/valibot";
export const companySchema = object({
    id: number(),
    ruc: string([toTrimmed(), regex(RUC_REGEX, "Ruc no válido")]),
    razon_social: string([
        toTrimmed(),
        minLength(3, "Este campo permite como mínimo 3 caracteres"),
    ]),
    nombre_comercial: string([
        toTrimmed(),
        minLength(3, "Este campo permite como mínimo 3 caracteres"),
    ]),
    sol_user: string([toTrimmed()]),
    sol_pass: string([toTrimmed()]),
    // only guia de remision
    client_id: nullable(string()),
    client_secret: nullable(string()),
    certificado_password: nullable(string()),
    mode: union([literal("development"), literal("production")]),
    logo_facturacion: nullable(array(filesSchema([300]))), // logo que se muestra en las facturas, boleta, nota,etc.
    certificado_digital: nullable(array(filesSchema())), //certificado digital
    empresa_id: number(),
});
export type CompanySchema = Input<typeof companySchema>;
