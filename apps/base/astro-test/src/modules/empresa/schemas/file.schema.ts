import { timestampsObject } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/modules/upload.schema";
import type { UserCreated } from "@modules/user/schemas/user.schema";
import { array, type Input, number, object, string } from "@vigilio/valibot";

export const fileSchema = object({
    id: number(),
    name: string(),
    file: array(filesSchema()),
    history: array(string()),
    user_id: number("Esta campo es obligatorio."),
    ...timestampsObject.entries,
});
export type FileSchema = Input<typeof fileSchema>;
export type FileSchemaFromServer = Input<typeof fileSchema> & {
    user: UserCreated;
};
export type FileSchemaToClient = Pick<FileSchema, "id" | "name" | "file">;
