import { PASSWORD_REGEX } from "@infrastructure/libs";
import { createZodDto } from "nestjs-zod"; // Assuming nestjs-zod is installed nicely
// import validFileValibot from "@infrastructure/libs/client/valibot";
import { z } from "zod";
import { userSchema } from "../schemas/user.schema";

export const userStoreSchema = userSchema.omit({
    id: true,
    code: true,
    intentos_session: true,
    intentos_session_date: true,
    subscription: true,
    ultima_conexion: true,
    enabled_notifications_webpush: true,
    slug: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
});
export class UserStoreDto extends createZodDto(userStoreSchema) {}

export const userStoreClientSchema = userStoreSchema.merge(
    z.object({
        repeat_password: z
            .string()
            .min(8)
            .max(100)
            .refine((val) => PASSWORD_REGEX.test(val), {
                message: "Repetir contraseña no válida.",
            }),
        photo: z
            .array(z.instanceof(File)) // custom check needed? Swagger won't like File type directly usually, maybe separate DTO for Swagger or use @ApiProperty
            .min(1)
            .max(1)
            .nullable()
            .optional(),
        wallpaper: z
            .array(z.instanceof(File))
            .min(1)
            .max(1)
            .nullable()
            .optional(),
    })
);
export class UserStoreClientDto extends createZodDto(userStoreClientSchema) {}

export const userUpdateSchema = userSchema
    .omit({
        id: true,
        code: true,
        password: true,
        intentos_session: true,
        intentos_session_date: true,
        slug: true,
        subscription: true,
        enabled_notifications_webpush: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        ultima_conexion: true,
    })
    .partial();
export class UserUpdateDto extends createZodDto(userUpdateSchema) {}

export const userUpdatePhotoSchema = userStoreClientSchema.pick({
    photo: true,
});
export class UserUpdatePhotoDto extends createZodDto(userUpdatePhotoSchema) {}

export const userUpdatePasswordSchema = userSchema
    .pick({ password: true })
    .merge(
        z.object({
            repeat_password: z
                .string()
                .min(8)
                .max(100)
                .refine((val) => PASSWORD_REGEX.test(val), {
                    message: "Repetir contraseña no válida.",
                }),
        })
    );
export class UserUpdatePasswordDto extends createZodDto(
    userUpdatePasswordSchema
) {}
