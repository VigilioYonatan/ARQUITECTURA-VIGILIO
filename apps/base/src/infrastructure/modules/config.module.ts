import enviroments from "@infrastructure/config/server/environments.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            load: [enviroments],
            envFilePath: [".env"],
        }),
    ],
    exports: [ConfigModule],
})
export class AppConfigModule {}
