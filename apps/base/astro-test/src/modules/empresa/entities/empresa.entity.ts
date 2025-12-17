// src/empresa/entitites/empresa.entity.ts (o empresa.schema.ts)

import type { Entity } from "@infrastructure/types/server";
import { userEntity } from "@modules/users/entities/user.entity";
import { type InferSelectModel, relations } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import type { EmpresaSchema } from "../schemas/empresa.schema";
import { addressEntity } from "./address.entity";
import { companyEntity } from "./company.entity";

export const empresaEntity = pgTable("empresa", {
	id: serial("id").primaryKey(),
	name_empresa: varchar({ length: 255 }).notNull(),
	dial_code: varchar({ length: 20 }).notNull(),
	model_ai_groq: varchar({ length: 100 }).notNull(),
	telefono: varchar({ length: 20 }).notNull(),
	token_ai: varchar({ length: 255 }).notNull(),
	color_primary: varchar({ length: 100 }).notNull(),
	timezone: varchar({ length: 100 }).notNull(),
	enabled_automatic_payment: boolean().default(false).notNull(),
	enabled_send_sunat: boolean().default(false).notNull(),
	enabled_send_pdf: boolean().default(false).notNull(),
	logo_facturacion: jsonb().notNull(),
	certificado_digital: jsonb().notNull(),
	address_id: integer()
		.references(() => addressEntity.id)
		.notNull(),
	user_id: integer()
		.references(() => userEntity.id)
		.notNull(),
	created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const empresaRelations = relations(empresaEntity, ({ one }) => ({
	// BelongsTo Address (Relación 1:1)
	address: one(addressEntity, {
		fields: [empresaEntity.address_id],
		references: [addressEntity.id],
	}),
	// **company debe tener una FK que apunte a empresa.id.**
	company: one(companyEntity, {
		fields: [empresaEntity.id],
		references: [companyEntity.empresa_id],
		relationName: "company_details",
	}),
	// BelongsTo User (Relación N:1)
	user: one(userEntity, {
		fields: [empresaEntity.user_id],
		references: [userEntity.id],
	}),
}));

export type EmpresaEntity = Entity<
	EmpresaSchema,
	InferSelectModel<typeof empresaEntity>
>;
