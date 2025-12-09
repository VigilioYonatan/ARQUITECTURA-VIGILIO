import { type Input, omit } from "@vigilio/valibot";
import { iconSchema } from "../schemas/icon.schema";

export const iconStoreDto = omit(iconSchema, [
    "id",
    "code",
    "created_at",
    "updated_at",
]);
export type IconStoreDto = Input<typeof iconStoreDto>;

export const iconUpdateDto = omit(iconSchema, [
    "id",
    "code",
    "created_at",
    "updated_at",
]);
export type IconUpdateDto = Input<typeof iconUpdateDto>;
