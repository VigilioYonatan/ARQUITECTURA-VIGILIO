import { z } from "@infrastructure/config/zod-i18n.config";
import { filesSchema } from "@modules/uploads/schemas/upload.schema";
import type { UserCreated } from "@modules/users/schemas/user.schema";

export const fileSchema = z.object({
    id: z.number(),
    name: z.string(),
    file: z.array(filesSchema()),
    history: z.array(z.string()),
    user_id: z.number(),
    created_at: z.date(),
    updated_at: z.date(),
});
export type FileSchema = z.infer<typeof fileSchema>;
export type FileSchemaFromServer = z.infer<typeof fileSchema> & {
    user: UserCreated;
};
export type FileSchemaToClient = Pick<FileSchema, "id" | "name" | "file">;
