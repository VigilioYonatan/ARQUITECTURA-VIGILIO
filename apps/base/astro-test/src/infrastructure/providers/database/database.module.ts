import type { Enviroments } from "@infrastructure/config/server/environments.config";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./database.schema";

export const DRIZZLE = Symbol("DRIZZLE_CONNECTION");

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: DRIZZLE,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<Enviroments>) => {
                const pool = new Pool({
                    connectionString: configService.getOrThrow("DATABASE_URL"),
                });
                const db = drizzle(pool, {
                    schema,
                    logger:
                        configService.getOrThrow("NODE_ENV") === "development",
                });
                return db;
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule {}
