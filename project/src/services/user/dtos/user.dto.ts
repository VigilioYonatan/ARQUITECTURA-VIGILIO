import {
    array,
    custom,
    Input,
    instance,
    maxLength,
    merge,
    minLength,
    nullable,
    object,
    omit,
    pick,
    string,
} from "@vigilio/valibot";
import { PASSWORD_REGEX } from "@/infrastructure/libs";
import validFileValibot from "@/infrastructure/libs/client/valibot";
import { userSchema } from "../schemas/user.schema";

export const userStoreDto = omit(userSchema, [
    "id",
    "code",
    "intentos_session",
    "intentos_session_date",
    "subscription",
    "user_id",
    "slug",
    "created_at",
    "updated_at",
    "deleted_at",
]);
export type UserStoreDto = Input<typeof userStoreDto>;

export const userStoreClientDto = merge([
    userStoreDto,
    object({
        repeat_password: string([
            minLength(8),
            maxLength(100),
            custom(
                (val) => PASSWORD_REGEX.test(val),
                "Repetir contraseña no válida."
            ),
        ]),
        photo: nullable(
            array(instance(File), "Archivos no válidos.", [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                }),
            ])
        ),
        wallpaper: nullable(
            array(instance(File), "Archivos no válidos.", [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 1,
                }),
            ])
        ),
    }),
]);
export type UserStoreClientDto = Input<typeof userStoreClientDto>;

export const userUpdateDto = omit(userSchema, [
    "id",
    "code",
    "user_id",
    "password",
    "intentos_session",
    "intentos_session_date",
    "slug",
    "subscription",
    "created_at",
    "updated_at",
    "deleted_at",
]);
export type UserUpdateDto = Input<typeof userUpdateDto>;

export const userUpdatePhotoDto = pick(userStoreClientDto, ["photo"]);
export type UserUpdatePhotoDto = Input<typeof userUpdatePhotoDto>;

export const userUpdatePasswordDto = merge([
    pick(userSchema, ["password"]),
    object({
        repeat_password: string([
            minLength(8),
            maxLength(100),
            custom(
                (val) => PASSWORD_REGEX.test(val),
                "Repetir contraseña no válida."
            ),
        ]),
    }),
]);
export type UserUpdatePasswordDto = Input<typeof userUpdatePasswordDto>;
