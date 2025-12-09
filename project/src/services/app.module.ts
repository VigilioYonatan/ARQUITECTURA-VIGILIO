import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import enviroments from "~/config/server/environments.config";
import { AppConfigModule } from "./infrastructure/modules/config.module";
import { DatabaseModule } from "./infrastructure/modules/database.module";
import { UploadModule } from "./infrastructure/modules/upload.module";
import { UserModule } from "./user/modules/user.module";
import { WebModule } from "./web/modules/web.module";

@Module({
    imports: [
        AppConfigModule,
        LoggerModule.forRoot({
            pinoHttp: {
                transport:
                    enviroments().NODE_ENV === "development"
                        ? {
                              target: "pino-pretty",
                              options: {
                                  colorize: true,
                                  translateTime: "HH:MM:ss Z",
                                  singleLine: true,
                                  ignore: "pid,hostname",
                                  messageFormat: "[{context}] {msg}",
                              },
                          }
                        : undefined,
            },
        }),
        CacheModule.register({
            ttl: 30, // tiempo por defecto en segundos
            max: 100, // número máximo de items en memoria
            isGlobal: true,
            // store: redisStore, // para usar Redis
            // host: 'localhost',
            // port: 6379,
        }),
        UploadModule,
        DatabaseModule,
        WebModule,
        // UserModule,
    ],
})
export class AppModule {}
