import { cityEntity } from "@modules/ubigeo/entities/city.entity";
import { userEntity } from "@modules/user/entities/user.entity";
import {
    type InferInsertModel,
    type InferSelectModel,
    relations,
} from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const addressEntity = pgTable("address", {
    id: serial("id").primaryKey(),
    ubigeo: varchar("ubigeo", { length: 10 }),
    urbanizacion: varchar("urbanizacion", { length: 300 }),
    direccion: varchar("direccion", { length: 300 }),
    cod_local: varchar("cod_local", { length: 20 }),
    city_id: integer("city_id").references(() => cityEntity.id),
    user_id: integer("user_id").references(() => userEntity.id),
});

export const addressRelations = relations(addressEntity, ({ one }) => ({
    city: one(cityEntity, {
        fields: [addressEntity.city_id],
        references: [cityEntity.id],
    }),
    user: one(userEntity, {
        fields: [addressEntity.user_id],
        references: [userEntity.id],
    }),
}));

export type Address = InferSelectModel<typeof addressEntity>;
export type NewAddress = InferInsertModel<typeof addressEntity>;
