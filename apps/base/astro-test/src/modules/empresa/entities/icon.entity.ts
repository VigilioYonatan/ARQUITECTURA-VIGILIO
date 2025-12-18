import type { Entity } from "@infrastructure/types/server";
import type { FilesSchema } from "@modules/uploads/schemas/upload.schema";
import { type InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { IconSchema } from "../schemas/icon.schema";

export const iconEntity = pgTable("icons", {
    id: serial().primaryKey(),
    code: text().notNull().unique(),
    name: text().notNull(),
    icon: text(),
    slug: text().notNull(),
    photo: jsonb().$type<FilesSchema[]>().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
});
export type IconEntity = Entity<
    IconSchema,
    InferSelectModel<typeof iconEntity>
>;
