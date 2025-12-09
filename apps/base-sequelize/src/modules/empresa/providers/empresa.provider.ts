import { EmpresaEntity,  } from "../entities/empresa.entity";

export const EMPRESA_REPOSITORY = Symbol("EMPRESA_REPOSITORY");

export const empresaProviders = [
    {
        provide: EMPRESA_REPOSITORY,
        useValue: EmpresaEntity,
    },
];
