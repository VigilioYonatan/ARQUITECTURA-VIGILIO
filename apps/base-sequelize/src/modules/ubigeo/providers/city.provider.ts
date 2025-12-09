import { CityEntity } from "../entities/city.entity";

export const CITY_REPOSITORY = Symbol("CITY_REPOSITORY");

export const cityProviders = [
    {
        provide: CITY_REPOSITORY,
        useValue: CityEntity,
    },
];
