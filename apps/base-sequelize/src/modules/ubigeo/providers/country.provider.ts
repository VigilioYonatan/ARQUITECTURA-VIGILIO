import { CountryEntity } from "../entities/country.entity";

export const COUNTRY_REPOSITORY = Symbol("COUNTRY_REPOSITORY");

export const countryProviders = [
    {
        provide: COUNTRY_REPOSITORY,
        useValue: CountryEntity,
    },
];
