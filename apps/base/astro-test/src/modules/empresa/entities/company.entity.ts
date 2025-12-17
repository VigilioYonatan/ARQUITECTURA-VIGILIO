import type { Entity } from "@infrastructure/types/server";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type CompanySchema } from "../schemas/company.schema";
import { empresaEntity } from "./empresa.entity";

export const companyEntity = pgTable("company", {
	id: serial("id").primaryKey(),
	ruc: varchar("ruc", { length: 200 }).notNull(),
	razon_social: varchar("razon_social", { length: 200 }).notNull(),
	nombre_comercial: varchar("nombre_comercial", { length: 200 }).notNull(),
	sol_user: varchar("sol_user", { length: 100 }).notNull(),
	sol_pass: varchar("sol_pass", { length: 100 }).notNull(),
	client_id: varchar("client_id", { length: 200 }),
	client_secret: varchar("client_secret", { length: 200 }),
	certificado_password: varchar("certificado_password", { length: 200 }),
	mode: varchar("mode", { length: 20 })
		.notNull()
		.$type<CompanySchema["mode"]>(),
	logo_facturacion:
		json("logo_facturacion").$type<CompanySchema["logo_facturacion"]>(),
	certificado_digital: json("certificado_digital").$type<
		CompanySchema["certificado_digital"]
	>(),
	empresa_id: integer("empresa_id")
		.references(() => empresaEntity.id)
		.notNull(),
});

export const companyRelations = relations(companyEntity, ({ one }) => ({
	empresa: one(empresaEntity, {
		fields: [companyEntity.empresa_id],
		references: [empresaEntity.id],
	}),
}));

export type Company = Entity<
	CompanySchema,
	InferSelectModel<typeof companyEntity>
>;
