import enviroments from "@infrastructure/config/server/environments.config";
import { UbigeoSeeder } from "@modules/ubigeo/seeder/ubigeo.seeder";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../database.module";
import { SeederService } from "./seeder.service";

@Module({
    imports: [
        // Importamos ConfigModule para que DatabaseModule funcione
        ConfigModule.forRoot({
            isGlobal: true,
            load: [enviroments],
            envFilePath: [".env"],
            cache: true, // Mejora performance leyendo process.env una sola vez
            expandVariables: true,
        }),
        DatabaseModule,
    ],
    providers: [SeederService, UbigeoSeeder],
})
export class SeederModule {}
