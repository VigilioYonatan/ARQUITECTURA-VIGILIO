import { PASSWORD_REGEX, timestampsObject } from "@/infrastructure/libs";
import { filesSchema } from "@/infrastructure/schemas/upload.schema";
import {
    array,
    coerce,
    custom,
    date,
    email,
    Input,
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
    email: nullable(string([email(), maxLength(255)])),
    type_identification: union([literal("DNI"), literal("CE"), literal("PAS")]),
    identification: nullable(string([maxLength(100)])),
    password: nullable(
        string([
            minLength(8),
            maxLength(100),
            custom(
                (val) => PASSWORD_REGEX.test(val),
                "La contraseña no es válida."
            ),
        ])
    ),
    profesion: nullable(string([minLength(3), maxLength(100)])),
    presentation: nullable(string([maxLength(3000)])),
    photo: nullable(array(filesSchema([100, 500]))),
    // wallpaper: nullable(array(filesSchema([100, 1200]))),
    role: union([literal("super-admin"), literal("administracion")]),
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
    ultima_conexion: nullable(coerce(date(), (val) => new Date(val as Date))),
    address: string([maxLength(500)]),
    subscription: nullable(subscription),
    user_id: nullable(number()),
    // city_id: nullable(number()),
    slug: string([maxLength(255)]),
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
    | "identification"
    | "type_identification"
    | "telefono"
    | "full_name"
    | "father_lastname"
    | "mother_lastname"
    | "role"
>;

export type UserSchemaFromServer = UserSchema & {};
export type UserAuth = UserSchemaFromServer;
