import { z } from "@infrastructure/config/zod-i18n.config";

export const regionSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    country_id: z.number(),
});

export type RegionSchema = z.infer<typeof regionSchema>;
