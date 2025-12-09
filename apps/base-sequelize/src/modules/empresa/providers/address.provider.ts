import { AddressEntity } from "../entities/address.entity";

export const ADDRESS_REPOSITORY = Symbol("ADDRESS_REPOSITORY");

export const addressProviders = [
    {
        provide: ADDRESS_REPOSITORY,
        useValue: AddressEntity,
    },
];
