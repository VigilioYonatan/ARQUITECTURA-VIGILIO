import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { CacheService } from "@infrastructure/providers/cache/cache.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import type { CountryRelations } from "../entities/country.entity";
import { UbigeoRepository } from "../repositories/ubigeo.repository";

@Injectable()
export class UbigeoService {
    constructor(
        private readonly ubigeoRepository: UbigeoRepository,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly cacheService: CacheService
    ) {}

    async index() {
        let data =
            await this.cacheService.cacheGetJson<CountryRelations | null>(
                "ubigeo"
            );

        if (!data) {
            data = await this.ubigeoRepository.findPeruWithRegionsAndCities();
            if (data) {
                await this.cache.set(
                    "ubigeo",
                    JSON.stringify(data),
                    cacheTimes.days30
                );
            }
        }

        return {
            success: true,
            data,
        };
    }
}
