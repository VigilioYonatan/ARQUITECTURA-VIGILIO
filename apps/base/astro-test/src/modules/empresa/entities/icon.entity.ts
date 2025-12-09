// ../entities/icon.schema.ts

import type { Entity } from "@infrastructure/types/server";
import { type InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import type { IconSchema } from "../schemas/icon.schema";
import type { FilesSchema } from "@modules/uploads/modules/upload.schema";

export const iconEntity = pgTable("icons", {
    id: serial().primaryKey(),
    code: text().notNull().unique(),
    name: text().notNull(),
    icon: text(),
    slug: text().notNull(),
    photo: jsonb().$type<FilesSchema[]>().notNull(),
});
export type IconEntity = Entity<
    IconSchema,
    InferSelectModel<typeof iconEntity>
>;
