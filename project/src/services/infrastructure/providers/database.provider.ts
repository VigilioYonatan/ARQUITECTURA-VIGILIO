import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";
import { User } from "@/user/entities/user.entity";
import { type Enviroments } from "~/config/server/environments.config";

export const DB_CLIENT = Symbol("DB_CLIENT");

export const DatabaseProvider: Provider = {
    provide: DB_CLIENT,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<Enviroments>) => {
        const sequelize = new Sequelize({
            dialect: "postgres",
            host: configService.get("DB_HOST"),
            username: configService.get("DB_USER"),
            password: configService.get("DB_PASS"),
            database: configService.get("DB_NAME"),
            // port: enviroments.DB_PORT,
            pool: {
                max: 50,
                min: 15,
                acquire: 30000,
                idle: 30000,
                evict: 10000,
            },
            retry: {
                max: 3, // Intentar reconectar 3 veces
                match: [
                    /SequelizeConnectionError/,
                    /SequelizeConnectionRefusedError/,
                    /SequelizeHostNotFoundError/,
                    /SequelizeHostNotReachableError/,
                    /SequelizeInvalidConnectionError/,
                    /SequelizeConnectionTimedOutError/,
                ],
            },
            dialectOptions: {
                useUTC: true, // Para MySQL/MariaDB
                timezone: "Etc/UTC",
                connectTimeout: 10000, // 10 segundos para conexión inicial
            },
            timezone: "+00:00",
            define: {
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                underscored: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
                deletedAt: "deleted_at",
            },
        });
        // here entities
        sequelize.addModels([User]);
        await sequelize.sync({ alter: true });
        return sequelize;
    },
};
