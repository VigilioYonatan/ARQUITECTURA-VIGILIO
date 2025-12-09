import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import enviroments from "~/config/server/environments.config";

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
