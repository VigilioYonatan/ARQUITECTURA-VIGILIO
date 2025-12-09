import type { Enviroments } from "@infrastructure/config/server/environments.config";
import {
    Injectable,
    type OnModuleDestroy,
    type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";
import { PrismaClient } from "@src/generated/prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(configService: ConfigService<Enviroments>) {
        const adapter = new PrismaPostgresAdapter({
            connectionString: configService.get("DATABASE_URL") as string,
        });
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
