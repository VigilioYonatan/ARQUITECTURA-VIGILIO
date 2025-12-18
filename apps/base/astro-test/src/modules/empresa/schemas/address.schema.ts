import { z } from "@infrastructure/config/zod-i18n.config";
import { POSIVES_NUMERIC_REGEX } from "@infrastructure/libs";
import type { CitySchema } from "@modules/ubigeo/schemas/city.schema";
import type { CountrySchema } from "@modules/ubigeo/schemas/country.schema";
import type { RegionSchema } from "@modules/ubigeo/schemas/region.schema";
import type { UserSelect } from "@modules/users/schemas/user.schema";

export const addressSchema = z.object({
    id: z.number(),
    ubigeo: z
        .string()
        .trim()
        .min(1)
        .regex(POSIVES_NUMERIC_REGEX, "Este campo permite solo números."),
    urbanizacion: z.string().trim().min(1),
    direccion: z.string().trim().min(1),
    cod_local: z.string().trim(),
    city_id: z.number(),
    user_id: z.number(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
export type AddressSchema = z.infer<typeof addressSchema>;
export type AddressSchemaFromServer = AddressSchema & {
    city: CitySchema & { region: RegionSchema & { country: CountrySchema } };
    user: UserSelect;
};
