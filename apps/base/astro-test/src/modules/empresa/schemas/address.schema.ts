import { POSIVES_NUMERIC_REGEX, timestampsObject } from "@infrastructure/libs";
import type { CitySchema } from "@modules/ubigeo/schemas/city.schema";
import type { CountrySchema } from "@modules/ubigeo/schemas/country.schema";
import type { RegionSchema } from "@modules/ubigeo/schemas/region.schema";
import type { UserSelect } from "@modules/user/schemas/user.schema";
import {
    type Input,
    minLength,
    number,
    object,
    regex,
    string,
    toTrimmed,
} from "@vigilio/valibot";

export const addressSchema = object({
    id: number(),
    ubigeo: string([
        toTrimmed(),
        minLength(1),
        regex(POSIVES_NUMERIC_REGEX, "Este campo permite solo números."),
    ]),
    urbanizacion: string([toTrimmed(), minLength(1)]),
    direccion: string([toTrimmed(), minLength(1)]),
    cod_local: string([toTrimmed()]),
    city_id: number(),
    user_id: number(),
    ...timestampsObject.entries,
});
export type AddressSchema = Input<typeof addressSchema>;
export type AddressSchemaFromServer = AddressSchema & {
    city: CitySchema & { region: RegionSchema & { country: CountrySchema } };
    user: UserSelect;
};
