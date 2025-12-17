import { z } from "zod";
import { fileSchema } from "../schemas/file.schema";

export const fileStoreDto = fileSchema.omit({
    id: true,
    history: true,
    user_id: true,
    created_at: true,
    updated_at: true,
});

export type FileStoreDto = z.infer<typeof fileStoreDto>;

export const fileStoreClientDto = fileStoreDto.extend({
    file: z
        .array(z.instanceof(File))
        .min(1)
        .max(1)
        // Add custom validation logic if needed matching validFileValibot capabilities or generic Zod
        .refine(
            (files) => files.every((file) => file.size <= 250 * 1024 * 1024),
            "Tamaño máximo 250MB"
        ),
    // .refine(files => check extensions...)
});

export type FileStoreClientDto = z.infer<typeof fileStoreClientDto>;

export const fileUpdateFileDto = fileStoreClientDto.pick({ file: true });

export type FileUpdateClientDto = z.infer<typeof fileUpdateFileDto> & {
    name: string;
};
