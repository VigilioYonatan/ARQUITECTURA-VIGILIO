import { DrizzleExceptionFilter } from "@infrastructure/filters/drizzle-exception.filter";
import { HttpExceptionFilter } from "@infrastructure/filters/http-exception.filter";
import { InitialCacheMiddleware } from "@infrastructure/middlewares/initial.middleware";
import { AppConfigModule } from "@infrastructure/modules/config.module";
import { AppCacheModule } from "@infrastructure/providers/cache/cache.module";
import { DatabaseModule } from "@infrastructure/providers/database/database.module";
import { AppLoggerModule } from "@infrastructure/providers/logger/logger.module";
import { AuthModule } from "@modules/auth/auth.module";
import { HealthModule } from "@modules/health/health.module";
import { UbigeoModule } from "@modules/ubigeo/modules/ubigeo.module";
import { UploadModule } from "@modules/uploads/modules/upload.module";
import { UserModule } from "@modules/users/modules/user.module";
import {
    type MiddlewareConsumer,
    Module,
    type NestModule,
    RequestMethod,
} from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { WebModule } from "./modules/web/web.module";

@Module({
    imports: [
        AppConfigModule,
        AppCacheModule,
        AppLoggerModule,
        DatabaseModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
        ]),
        UserModule,
        UbigeoModule,
        UploadModule,
        WebModule,
        AuthModule,
        HealthModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: DrizzleExceptionFilter },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(InitialCacheMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL }); // <--- Aplica a TODO
    }
}
