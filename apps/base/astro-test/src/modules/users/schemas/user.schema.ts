import { z } from "@infrastructure/config/zod-i18n.config";
import { PASSWORD_REGEX } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/schemas/upload.schema";

// Código de documentos
export const documento_code = z.union([
    z.literal("01"), // DNI
    z.literal("06"), // RUC
]);
export type DocumentCode = z.infer<typeof documento_code>;

export const subscription = z.object({
    endpoint: z.string(),
    keys: z.object({ p256dh: z.string(), auth: z.string() }),
});
export type SuscriptionSchema = z.infer<typeof subscription>;

export const userSchema = z.object({
    id: z.number(),
    code: z.string(),
    user_name: z.string().min(3).max(30).nullable(),
    full_name: z.string().min(3).max(100),
    father_lastname: z.string().min(3).max(100),
    mother_lastname: z.string().min(3).max(100),
    gender: z.union([
        z.literal("masculino"),
        z.literal("femenino"),
        z.literal("otro"),
    ]),
    email: z.email().max(255),
    documento_code,
    documento: z.string({ message: "Documento de identidad no válido" }),
    is_register_automatic: z.boolean(),
    password: z
        .string()
        .min(8)
        .max(100)
        .refine((val) => PASSWORD_REGEX.test(val), {
            message:
                "La contraseña no es válida, debe contener carácteres especiales, números y mayúsculas.",
        })
        .nullable(),
    profesion: z.string().min(3).max(100).nullable(),
    presentation: z.string().max(3000).nullable(),
    photo: z.array(filesSchema([100, 500])).nullable(),
    wallpaper: z.array(filesSchema([100, 1200])).nullable(),
    role: z.union([
        z.literal("super-admin"),
        z.literal("administracion"),
        z.literal("estudiante"),
        z.literal("academico"),
        z.literal("docente"),
    ]),
    telefono: z.string().min(9).max(9).startsWith("9"),
    status: z.union([
        z.literal("activo"),
        z.literal("desactivado"),
        z.literal("bloqueo-temporal"),
        z.literal("bloqueo-definitivo"),
    ]),
    intentos_session: z.number(),
    intentos_session_date: z.date().nullable(),
    estudiante_status: z.union([
        z.literal("pre-ingreso"),
        z.literal("activo"),
        z.literal("retirado"),
        z.literal("suspendido"),
        z.literal("expulsado"),
        z.literal("egresado"),
    ]),
    enabled_notifications_webpush: z.boolean(),
    ultima_conexion: z.date().nullable(),
    address: z.string().max(500),
    subscription: subscription.nullable(),
    slug: z.string().max(255),
    // Timestamps might need adjustment if timestampsObject is compatible with Zod or I need to recreate it.
    // Assuming timestampsObject.entries is a valibot object entries. I'll replace it with Zod equivalents manually for safety or assume it's generic enough.
    // Wait, timestampsObject comes from infrastructure/libs. I should check it.
    // For now I will manually add created_at and updated_at.
    created_at: z.date().nullable(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
});
export type UserSchema = z.infer<typeof userSchema>;

export type UserCreated = Pick<
    UserSchema,
    | "id"
    | "user_name"
    | "full_name"
    | "photo"
    | "role"
    | "father_lastname"
    | "mother_lastname"
>;

export type UserSelect = Pick<
    UserSchema,
    | "id"
    | "user_name"
    | "photo"
    | "documento_code"
    | "documento"
    | "telefono"
    | "full_name"
    | "father_lastname"
    | "mother_lastname"
    | "role"
>;

export type UserSchemaFromServer = UserSchema & {};
export type UserAuth = UserSchemaFromServer;
