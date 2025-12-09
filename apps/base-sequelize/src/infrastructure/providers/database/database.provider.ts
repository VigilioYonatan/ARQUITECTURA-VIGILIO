import type { Enviroments } from "@infrastructure/config/server/environments.config";
import { CityEntity } from "@modules/ubigeo/entities/city.entity";
import { CountryEntity } from "@modules/ubigeo/entities/country.entity";
import { RegionEntity } from "@modules/ubigeo/entities/region.entity";
import { UserEntity } from "@modules/user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";
import { DatabaseService } from "./database.service";

export const databaseProviders = [
    {
        provide: "SEQUELIZE",
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<Enviroments>) => {
            const sequelize = new Sequelize({
                dialect: "postgres",
                host: configService.getOrThrow("DB_HOST"),
                port: configService.getOrThrow("DB_PORT"),
                username: configService.getOrThrow("DB_USER"),
                password: configService.getOrThrow("DB_PASS"),
                database: configService.getOrThrow("DB_NAME"),
            });
            sequelize.addModels([
                UserEntity,
                CountryEntity,
                RegionEntity,
                CityEntity,
                
            ]);
            await sequelize.sync();
            return sequelize;
        },
    },
    DatabaseService,
];
