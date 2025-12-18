import type { Entity } from "@infrastructure/types/server";
import type { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import type { UserSchema } from "../schemas/user.schema";

export const userEntity = pgTable("user", {
    id: serial().primaryKey(),
    code: varchar({ length: 20 }).notNull(),
    user_name: varchar({ length: 100 }),
    email: varchar({ length: 255 }).notNull(),
    documento_code: varchar({ length: 100 })
        .$type<UserSchema["documento_code"]>()
        .notNull(),
    documento: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    full_name: varchar({ length: 100 }).notNull(),
    father_lastname: varchar({ length: 100 }).notNull(),
    mother_lastname: varchar({ length: 100 }).notNull(),
    gender: varchar()
        .$type<UserSchema["gender"]>()
        .default("masculino")
        .notNull(),
    password: varchar({ length: 100 }),
    profesion: varchar({ length: 100 }),
    presentation: text(),
    photo: jsonb().$type<UserSchema["photo"]>(),
    wallpaper: jsonb().$type<UserSchema["wallpaper"]>(),
    role: varchar().$type<UserSchema["role"]>().notNull(),
    telefono: varchar({ length: 30 }).notNull(),
    is_register_automatic: boolean().default(false).notNull(),
    status: varchar({ length: 30 }).$type<UserSchema["status"]>().notNull(),
    estudiante_status: varchar({ length: 30 })
        .$type<UserSchema["estudiante_status"]>()
        .notNull(),
    intentos_session: integer().default(0).notNull(),
    intentos_session_date: timestamp({
        withTimezone: true,
    }),
    ultima_conexion: timestamp({ withTimezone: true }),
    enabled_notifications_webpush: boolean().default(false).notNull(),
    address: varchar({ length: 500 }).notNull(),
    subscription: jsonb().$type<UserSchema["subscription"]>(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow(),
    deleted_at: timestamp({ withTimezone: true }),
});
export type UserEntity = Entity<
    UserSchema,
    InferSelectModel<typeof userEntity>
>;
