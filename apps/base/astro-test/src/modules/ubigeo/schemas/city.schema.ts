import { z } from "@infrastructure/config/zod-i18n.config";

export const citySchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    region_id: z.number(),
});
export type CitySchema = z.infer<typeof citySchema>;
