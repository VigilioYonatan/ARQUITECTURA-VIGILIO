import { z } from "zod";
import { iconSchema } from "../schemas/icon.schema";

export const iconStoreDto = iconSchema.omit({
    id: true,
    code: true,
    created_at: true,
    updated_at: true,
});
export type IconStoreDto = z.infer<typeof iconStoreDto>;

export const iconUpdateDto = iconSchema.omit({
    id: true,
    code: true,
    created_at: true,
    updated_at: true,
});
export type IconUpdateDto = z.infer<typeof iconUpdateDto>;
