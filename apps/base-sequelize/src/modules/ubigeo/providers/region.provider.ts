import { RegionEntity } from "../entities/region.entity";

export const REGION_REPOSITORY = Symbol("REGION_REPOSITORY");

export const regionProviders = [
    {
        provide: REGION_REPOSITORY,
        useValue: RegionEntity,
    },
];
