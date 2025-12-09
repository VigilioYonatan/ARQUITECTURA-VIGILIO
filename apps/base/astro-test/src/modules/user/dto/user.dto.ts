import { PASSWORD_REGEX } from "@infrastructure/libs";
import validFileValibot from "@infrastructure/libs/client/valibot";
import {
    array,
    custom,
    type Input,
    instance,
    maxLength,
    merge,
    minLength,
    nullable,
    object,
    omit,
    partial,
    pick,
    string,
} from "@vigilio/valibot";
import { userSchema } from "../schemas/user.schema";

export const userStoreDto = omit(userSchema, [
    "id",
    "code",
    "intentos_session",
    "intentos_session_date",
    "subscription",
    "ultima_conexion",
    "enabled_notifications_webpush",
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

export const userUpdateDto = partial(
    omit(userSchema, [
        "id",
        "code",
        "password",
        "intentos_session",
        "intentos_session_date",
        "slug",
        "subscription",
        "enabled_notifications_webpush",
        "created_at",
        "updated_at",
        "deleted_at",
    ])
);
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
