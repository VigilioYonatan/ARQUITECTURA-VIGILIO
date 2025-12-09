import { type Input, number, object, string } from "@vigilio/valibot";

export const countrySchema = object({
    id: number(),
    code: string(),
    name: string(),
    dial_code: string(),
});
export type CountrySchema = Input<typeof countrySchema>;
