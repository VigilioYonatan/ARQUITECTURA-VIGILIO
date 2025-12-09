import { SVG_REGEX, timestampsObject } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/modules/upload.schema";
import {
    array,
    type Input,
    nullable,
    number,
    object,
    regex,
    string,
} from "@vigilio/valibot";

export const iconSchema = object({
    id: number(),
    code: string(),
    name: string(),
    slug: string(),
    photo: array(filesSchema([100, 300])),
    ...timestampsObject.entries,
});

export type IconSchema = Input<typeof iconSchema>;

export type IconSchemaFromServer = IconSchema & {
    // user_academic: UserCreated;
};
