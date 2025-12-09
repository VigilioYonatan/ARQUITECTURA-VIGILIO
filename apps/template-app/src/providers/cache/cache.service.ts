import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get<string>("redis.host"),
            port: this.configService.get<number>("redis.port"),
            password: this.configService.get<string>("redis.password"),
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    async set(key: string, value: any, ttl?: number) {
        const serialized = JSON.stringify(value);
        if (ttl) {
            await this.client.set(key, serialized, "EX", ttl);
        } else {
            await this.client.set(key, serialized);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        if (!value) return null;
        return JSON.parse(value);
    }

    async del(key: string) {
        await this.client.del(key);
    }
}
