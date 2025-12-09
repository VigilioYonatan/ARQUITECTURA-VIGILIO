import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { validate } from "./config/env.validation";
import { StorageModule } from "./providers/storage/storage.module";
import { DatabaseModule } from "./providers/database/database.module";
import { HealthModule } from "./modules/health/health.module";
import { UsersModule } from "./modules/users/users.module";
import { FilesModule } from "./modules/files/files.module";
import { CommonModule } from "./common/common.module";
import { LoggerModule } from "nestjs-pino";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AstroController } from "./astro.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            validate: validate,
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const isProduction = config.get("NODE_ENV") === "production";
                return {
                    pinoHttp: {
                        level: isProduction ? "info" : "debug",
                        transport: isProduction
                            ? undefined
                            : {
                                  target: "pino-pretty",
                                  options: {
                                      singleLine: true,
                                  },
                              },
                        autoLogging: true,
                        serializers: {
                            req: (req) => ({
                                id: req.id,
                                method: req.method,
                                url: req.url,
                            }),
                        },
                    },
                };
            },
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
        ]),
        CommonModule,
        DatabaseModule,
        StorageModule,
        HealthModule,
        FilesModule,
        UsersModule,
        AuthModule,
        ServeStaticModule.forRoot({
            rootPath: join(
                __dirname,
                "..",
                "..",
                "astro-app",
                "dist",
                "client"
            ),
            serveRoot: "/",
            exclude: ["/api/(.*)"],
        }),
    ],
    controllers: [AstroController],
    providers: [],
})
export class AppModule {}
