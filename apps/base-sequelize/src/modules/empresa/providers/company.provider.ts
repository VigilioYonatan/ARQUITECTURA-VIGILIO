import { CompanyEntity } from "../entities/company.entity";

export const COMPANY_REPOSITORY = Symbol("COMPANY_REPOSITORY");

export const companyProviders = [
    {
        provide: COMPANY_REPOSITORY,
        useValue: CompanyEntity,
    },
];
