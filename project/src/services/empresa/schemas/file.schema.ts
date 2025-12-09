import { array, Input, number, object, string } from "@vigilio/valibot";
import { UserCreated } from "@/user/schemas/user.schema";
import { filesSchema } from "@/infrastructure/schemas/upload.schema";
import { timestampsObject } from "@/infrastructure/libs";

export const fileSchema = object({
    id: number(),
    name: string(),
    file: array(filesSchema()),
    user_id: number(),
    history: array(string()),
    ...timestampsObject.entries,
});
export type FileSchema = Input<typeof fileSchema>;
export type FileSchemaFromServer = Input<typeof fileSchema> & {
    user: UserCreated;
};
export type FileSchemaToClient = Pick<FileSchema, "id" | "name" | "file">;
