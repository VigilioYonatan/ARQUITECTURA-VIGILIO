import {
    array,
    Input,
    instance,
    merge,
    object,
    omit,
    pick,
} from "@vigilio/valibot";
import { fileSchema } from "../schemas/file.schema";
import validFileValibot from "@/infrastructure/libs/client/valibot";
import { EXTENSIONS } from "@/infrastructure/consts";

export const fileStoreDto = omit(fileSchema, [
    "id",
    "history",
    "user_id",
    "created_at",
    "updated_at",
]);

export type FileStoreDto = Input<typeof fileStoreDto>;

export const fileStoreClientDto = merge([
    fileStoreDto,
    object({
        file: array(instance(File), "Archivos no válidos.", [
            validFileValibot({
                required: true,
                min: 1,
                max: 1,
                types: Object.values(EXTENSIONS).flat(),
                maxSize: 250, // 250MB
            }),
        ]),
    }),
]);

export type FileStoreClientDto = Input<typeof fileStoreClientDto>;

export const fileUpdateFileDto = pick(fileStoreClientDto, ["file"]);

export type FileUpdateClientDto = Input<typeof fileUpdateFileDto> & {
    name: string;
};
