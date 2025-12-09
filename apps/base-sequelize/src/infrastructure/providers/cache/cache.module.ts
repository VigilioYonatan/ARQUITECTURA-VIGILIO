import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CacheService } from "./cache.service";

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async () => {
                // const url = configService.get("REDIS_URL");
                // const store = await redisStore({ url });
                return {
                    // store,
                    ttl: 5000,
                };
            },
        }),
    ],
    exports: [CacheService],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        CacheService,
    ],
})
export class AppCacheModule {}
