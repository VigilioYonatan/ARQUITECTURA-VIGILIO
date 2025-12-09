import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CacheService } from "../../providers/cache/cache.service";
import {
    CACHEABLE_KEY,
    CACHE_EVICT_KEY,
    CacheableOptions,
    CacheEvictOptions,
} from "../decorators/cache.decorator";

@Injectable()
export class AppCacheInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly cacheService: CacheService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        const cacheable = this.reflector.get<CacheableOptions>(
            CACHEABLE_KEY,
            context.getHandler()
        );
        const cacheEvict = this.reflector.get<CacheEvictOptions>(
            CACHE_EVICT_KEY,
            context.getHandler()
        );

        if (cacheable) {
            const key = this.generateKey(cacheable.key, context);
            const cachedValue = await this.cacheService.get(key);

            if (cachedValue) {
                console.log(`Cache HIT [${key}]`);
                return of(cachedValue);
            }

            console.log(`Cache MISS [${key}]`);
            return next.handle().pipe(
                tap(async (response) => {
                    await this.cacheService.set(
                        key,
                        response,
                        cacheable.ttl || 3600
                    );
                })
            );
        }

        if (cacheEvict) {
            return next.handle().pipe(
                tap(async () => {
                    const key = this.generateKey(cacheEvict.key, context);
                    console.log(`Cache EVICT [${key}]`);
                    await this.cacheService.del(key);
                })
            );
        }

        return next.handle();
    }

    private generateKey(prefix: string, context: ExecutionContext): string {
        const args = context.getArgs();
        // Assuming the first argument is the ID or key part if it's a string
        // This is a simple implementation. For production, might need more robust arg parsing.
        const id = args[0];
        if (typeof id === "string" || typeof id === "number") {
            return `${prefix}:${id}`;
        }
        return prefix;
    }
}
