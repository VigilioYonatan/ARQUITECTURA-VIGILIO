import { z } from "zod";

export function filesSchema(dimensions?: number[]) {
    return z.object({
        dimension: z
            .number()
            .refine((input) => !dimensions || dimensions.includes(input), {
                message: "Dimension Incorrecta",
            })
            .optional(),
        key: z.string(),
        name: z.string(),
        size: z.number(),
        mimetype: z.string(),
    });
}

export type FilesSchema = z.infer<ReturnType<typeof filesSchema>>;
