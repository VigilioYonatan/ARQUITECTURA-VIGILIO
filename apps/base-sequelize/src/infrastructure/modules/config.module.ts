import enviroments from "@infrastructure/config/server/environments.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [enviroments],
            envFilePath: [".env"],
            cache: true, // Mejora performance leyendo process.env una sola vez
            expandVariables: true, // Permite usar ${VAR} dentro del .env
        }),
    ],
    exports: [ConfigModule],
})
export class AppConfigModule {}
