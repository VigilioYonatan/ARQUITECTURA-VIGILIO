import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { CacheService } from "@infrastructure/providers/cache/cache.service";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { CityEntity } from "../entities/city.entity";
import { CountryEntity } from "../entities/country.entity";
import { RegionEntity } from "../entities/region.entity";
import { CITY_REPOSITORY } from "../providers/city.provider";
import { COUNTRY_REPOSITORY } from "../providers/country.provider";
import { REGION_REPOSITORY } from "../providers/region.provider";

@Injectable()
export class UbigeoService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly cacheService: CacheService,
        @Inject(COUNTRY_REPOSITORY)
        private countryRepository: typeof CountryEntity,
        @Inject(REGION_REPOSITORY)
        private regionRepository: typeof RegionEntity,
        @Inject(CITY_REPOSITORY)
        private cityRepository: typeof CityEntity
    ) {}

    async index() {
        let data = await this.cacheService.cacheGetJson("ubigeo");

        if (!data) {
            data = await this.countryRepository.findAll({
                include: [
                    {
                        model: this.regionRepository,
                        include: [
                            {
                                model: this.cityRepository,
                            },
                        ],
                    },
                ],
                where: {
                    dial_code: "51",
                },
            });
            await this.cache.set(
                "ubigeo",
                JSON.stringify(
                    (data as CityEntity[]).map((item) =>
                        item.get({ plain: true })
                    )
                ),
                cacheTimes.days30
            );
        }

        return {
            success: true,
            data,
        };
    }
}
