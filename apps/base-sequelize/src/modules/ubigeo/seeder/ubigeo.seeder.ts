import type { DatabaseService } from "@infrastructure/providers/database/database.service";
import { Injectable, Logger } from "@nestjs/common";
import type { Sequelize } from "sequelize-typescript";
import { CityEntity } from "../entities/city.entity";
import { CountryEntity } from "../entities/country.entity";
import { RegionEntity } from "../entities/region.entity";
import { departmentsSeeder } from "./data/peru/departamentos.seeder";
import { distritosSeeder } from "./data/peru/distritos.seeder";

@Injectable()
export class UbigeoSeeder {
    private readonly logger = new Logger(UbigeoSeeder.name);
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
        private readonly sequelize: Sequelize,
        private readonly databaseService: DatabaseService
    ) {}

    async run() {
        const t = await this.sequelize.transaction();
        try {
            await this.databaseService.bulkCreateWithNestedRelations(
                {
                    model: CountryEntity,
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
                    transaction: t,
                },
                [
                    {
                        childrenField: "regions",
                        relationField: "country_id",
                        config: {
                            model: RegionEntity,
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
                        relationField: "region_id",
                        config: {
                            model: CityEntity,
                            beforeCreate: (city, _index, parentResult) => ({
                                code: city.code,
                                name: city.name,
                                region_id: parentResult?.id,
                            }),
                        },
                    },
                ]
            );
            await t.commit();
        } catch (error) {
            this.logger.error(error);
            await t.rollback();
        }
    }
}
