import { bulkCreateWithNestedRelations } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable } from "@nestjs/common";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { departmentsSeeder } from "./data/peru/departamentos.seeder";
import { distritosSeeder } from "./data/peru/distritos.seeder";

@Injectable()
export class UbigeoSeeder {
	private readonly seeder = [
		{
			dial_code: "51",
			name: "Perú",
			regions: departmentsSeeder.map((dept) => ({
				code: dept.ubigeo,
				name: dept.name,
				cities: distritosSeeder
					.filter((dist) => dist.department_id === dept.ubigeo)
					.map((district) => ({
						code: district.ubigeo,
						name: district.name,
					})),
			})),
		},
	];
	constructor(
		@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
	) {}

	async run() {
		return await this.db.transaction(async (tx) => {
			return await bulkCreateWithNestedRelations(
				tx,
				{
					table: schema.country,
					data: this.seeder.map((c) => ({
						code: c.dial_code,
						dial_code: c.dial_code,
						name: c.name,
						regions: c.regions, // Pasamos las regiones anidadas con sus ciudades
					})),
					excludeFields: ["regions"], // Excluimos el campo 'regions' del modelo Country
					beforeCreate: (country) => ({
						code: country.code,
						name: country.name,
						dial_code: country.dial_code,
					}),
				},
				[
					{
						childrenField: "regions",
						foreignKeyField: "country_id",
						config: {
							table: schema.region,
							excludeFields: ["cities"], // Excluimos el campo 'cities' del modelo Region
							beforeCreate: (region, _index, parentResult) => ({
								code: region.code,
								name: region.name,
								country_id: parentResult?.id,
								cities: region.cities, // Mantenemos las ciudades para el siguiente nivel
							}),
						},
					},
					{
						childrenField: "cities",
						foreignKeyField: "region_id",
						config: {
							table: schema.city,
							beforeCreate: (city, _index, parentResult) => ({
								code: city.code,
								name: city.name,
								region_id: parentResult?.id,
							}),
						},
					},
				],
			);
		});
	}
}
