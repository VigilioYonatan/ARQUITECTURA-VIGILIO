import { COLOR_REGEX, timestampsObject } from "@infrastructure/libs";
import {
    boolean,
    type Input,
    maxLength,
    minLength,
    number,
    object,
    regex,
    string,
} from "@vigilio/valibot";

export const empresaSchema = object({
    id: number(),
    name_empresa: string([minLength(3), maxLength(200)]),
    dial_code: string(),
    model_ai_groq: string([minLength(3), maxLength(100)]),
    token_ai: string([minLength(4)]),
    color_primary: string([regex(COLOR_REGEX)]),
    timezone: string([minLength(3), maxLength(100)]),
    enabled_automatic_payment: boolean(),
    enabled_send_sunat: boolean(),
    enabled_send_pdf: boolean(),
    telefono: string([minLength(9), maxLength(9)]),
    address_id: number(),
    user_id: number("Esta campo es obligatorio."),
    ...timestampsObject.entries,
});
export type EmpresaSchema = Input<typeof empresaSchema>;
export type EmpresaSchemaFromServer = EmpresaSchema & {
    // user: UserCreated;
    // company: CompanySchema;
    // address: AddressSchemaFromServer;
};
