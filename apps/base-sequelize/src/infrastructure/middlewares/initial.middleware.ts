import { cacheTimes } from "@infrastructure/libs/server/helpers";
import type { CacheService } from "@infrastructure/providers/cache/cache.service";
import { AddressEntity } from "@modules/empresa/entities/address.entity";
import { CompanyEntity } from "@modules/empresa/entities/company.entity";
import type { EmpresaEntity } from "@modules/empresa/entities/empresa.entity";
import { EMPRESA_REPOSITORY } from "@modules/empresa/providers/empresa.provider";
import type { CompanySchema } from "@modules/empresa/schemas/company.schema";
import type { EmpresaSchemaFromServer } from "@modules/empresa/schemas/empresa.schema";
import { CityEntity } from "@modules/ubigeo/entities/city.entity";
import { CountryEntity } from "@modules/ubigeo/entities/country.entity";
import { RegionEntity } from "@modules/ubigeo/entities/region.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
    Inject,
    Injectable,
    Logger,
    type NestMiddleware,
} from "@nestjs/common";
import type { Cache } from "cache-manager";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class InitialCacheMiddleware implements NestMiddleware {
    private readonly logger = new Logger(InitialCacheMiddleware.name);
    constructor(
        @Inject(EMPRESA_REPOSITORY)
        private readonly empresaRepository: typeof EmpresaEntity,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
        private readonly cacheService: CacheService
    ) {}

    async use(req: Request, _res: Response, next: NextFunction) {
        let empresa: EmpresaSchemaFromServer | null =
            this.cacheService.cacheGetJson<EmpresaSchemaFromServer>("empresa");
        if (!empresa) {
            empresa = (await this.empresaRepository.findByPk(1, {
                raw: true,
                nest: true,
                include: [
                    // userModified("user"),
                    {
                        model: CompanyEntity,
                        attributes: {
                            exclude: [
                                "certificado_digital",
                                "certificado_password",
                                "client_id",
                                "client_secret",
                                "sol_pass",
                            ] satisfies (keyof CompanySchema)[],
                        },
                    },
                    {
                        model: AddressEntity,
                        include: [
                            {
                                model: CityEntity,
                                include: [
                                    {
                                        model: RegionEntity,
                                        include: [{ model: CountryEntity }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                
            })) as EmpresaSchemaFromServer;
            if (!empresa) {
                return next();
            }
            this.cache.set(
                "empresa",
                JSON.stringify(empresa),
                cacheTimes.days3
            );
        }

        req.locals = {
            user: {
                id: 1,
                name: "Vigilio Services",
            },
            empresa,
        };

        next();
    }
}
