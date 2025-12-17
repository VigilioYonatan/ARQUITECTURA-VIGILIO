import { z } from "@infrastructure/config/zod-i18n.config";

export const feriadoSchema = z.object({
    id: z.number(),
    name: z.string(),
    date: z.date(),
});
export type FeriadoSchema = z.infer<typeof feriadoSchema>;
