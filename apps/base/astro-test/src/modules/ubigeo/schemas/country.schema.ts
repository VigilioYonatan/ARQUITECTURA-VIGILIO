import { z } from "@infrastructure/config/zod-i18n.config";

export const countrySchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    dial_code: z.string(),
});
export type CountrySchema = z.infer<typeof countrySchema>;
