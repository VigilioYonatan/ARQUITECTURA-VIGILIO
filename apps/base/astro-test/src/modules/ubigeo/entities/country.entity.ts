import type { Entity } from "@infrastructure/types/server";
import { type InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import type { CountrySchema } from "../schemas/country.schema";
import { type RegionRelations, regionEntity } from "./region.entity";

export const countryEntity = pgTable("country", {
    id: serial().primaryKey(),
    code: varchar({ length: 255 }).unique().notNull(),
    dial_code: varchar({ length: 255 }).unique().notNull(),
    name: varchar({ length: 255 }).unique().notNull(),
});

export type CountryEntity = Entity<
    CountrySchema,
    InferSelectModel<typeof countryEntity>
>;

export const countriesRelations = relations(countryEntity, ({ many }) => ({
    regions: many(regionEntity),
}));

export type CountryRelations = CountryEntity & {
    regions?: RegionRelations[];
};
