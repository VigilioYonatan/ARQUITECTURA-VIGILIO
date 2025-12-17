import type { Environments } from "@infrastructure/config/server/environments.config";
import KeyvRedis from "@keyv/redis";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import Keyv from "keyv";
import { CacheService } from "./cache.service";

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<Environments>) => {
                const host = configService.get("REDIS_HOST"); // "dragonfly"
                const port = configService.get("REDIS_PORT") || 6379;
                const password = configService.get("REDIS_PASSWORD");

                // Construct Redis URL
                const redisUrl = password
                    ? `redis://:${password}@${host}:${port}`
                    : `redis://${host}:${port}`;

                const keyvRedis = new KeyvRedis(redisUrl);

                // Initialize Keyv with the Redis adapter
                const keyv = new Keyv({
                    store: keyvRedis,
                    ttl: 5000, // default TTL in ms
                });

                return {
                    store: keyv,
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
