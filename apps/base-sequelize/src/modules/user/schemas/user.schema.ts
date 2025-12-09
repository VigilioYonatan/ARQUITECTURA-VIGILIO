import { PASSWORD_REGEX, timestampsObject } from "@infrastructure/libs";
import { filesSchema } from "@modules/uploads/modules/upload.schema";
import {
    array,
    boolean,
    coerce,
    custom,
    date,
    email,
    type Input,
    literal,
    maxLength,
    minLength,
    nullable,
    number,
    object,
    startsWith,
    string,
    union,
} from "@vigilio/valibot";
// Código de documentos
export const documento_code = union([
    literal("01"), // DNI
    literal("06"), // RUC
]);
export type DocumentCode = Input<typeof documento_code>;
export const subscription = object({
    endpoint: string(),
    keys: object({ p256dh: string(), auth: string() }),
});
export type SuscriptionSchema = Input<typeof subscription>;

export const userSchema = object({
    id: number(),
    code: string(),
    user_name: nullable(string([minLength(3), maxLength(30)])),
    full_name: string([minLength(3), maxLength(100)]),
    father_lastname: string([minLength(3), maxLength(100)]),
    mother_lastname: string([minLength(3), maxLength(100)]),
    gender: union([literal("masculino"), literal("femenino"), literal("otro")]),
    email: string([email(), maxLength(255)]),
    documento_code,
    documento: string("Documento de identidad no válido"),
    is_register_automatic: boolean(),
    password: nullable(
        string([
            minLength(8),
            maxLength(100),
            custom(
                (val) => PASSWORD_REGEX.test(val),
                "La contraseña no es válida, debe contener carácteres especiales, números y mayúsculas."
            ),
        ])
    ),
    profesion: nullable(string([minLength(3), maxLength(100)])),
    presentation: nullable(string([maxLength(3000)])),
    photo: nullable(array(filesSchema([100, 500]))),
    wallpaper: nullable(array(filesSchema([100, 1200]))),
    role: union([
        literal("super-admin"),
        literal("administracion"),
        literal("estudiante"),
        literal("academico"),
        literal("docente"),
    ]),
    telefono: string([minLength(9), maxLength(9), startsWith("9")]),
    status: union([
        literal("activo"),
        literal("desactivado"),
        literal("bloqueo-temporal"),
        literal("bloqueo-definitivo"),
    ]),
    intentos_session: number(),
    intentos_session_date: nullable(
        coerce(date(), (val) => new Date(val as Date))
    ),
    estudiante_status: union([
        literal("pre-ingreso"),
        literal("activo"),
        literal("retirado"),
        literal("suspendido"),
        literal("expulsado"),
        literal("egresado"),
    ]),
    enabled_notifications_webpush: boolean(),
    ultima_conexion: nullable(coerce(date(), (val) => new Date(val as Date))),
    address: string([maxLength(500)]),
    subscription: nullable(subscription),
    slug: string([maxLength(255)]),
    user_id: nullable(number()),
    ...timestampsObject.entries,
    deleted_at: nullable(coerce(date(), (val) => new Date(val as Date))),
});
export type UserSchema = Input<typeof userSchema>;

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
