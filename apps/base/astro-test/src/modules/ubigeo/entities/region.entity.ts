import type { Entity } from "@infrastructure/types/server";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import type { RegionSchema } from "../schemas/region.schema";
import { cityEntity } from "./city.entity";
import { type CountryEntity, countryEntity } from "./country.entity";

export const regionEntity = pgTable("region", {
	id: serial().primaryKey(),
	code: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	country_id: integer()
		.notNull()
		.references(() => countryEntity.id),
});
export type RegionEntity = Entity<
	RegionSchema,
	InferSelectModel<typeof regionEntity>
>;

export const regionsRelations = relations(regionEntity, ({ one, many }) => ({
	country: one(countryEntity, {
		fields: [regionEntity.country_id],
		references: [countryEntity.id],
	}),
	cities: many(cityEntity),
}));
export type RegionRelations = RegionEntity & {
	country?: CountryEntity;
	cities?: InferSelectModel<typeof cityEntity>[];
};
