import { Module } from "@nestjs/common";
import { UbigeoController } from "../controllers/ubigeo.controller";
import { UbigeoRepository } from "../repositories/ubigeo.repository";
import { UbigeoSeeder } from "../seeder/ubigeo.seeder";
import { UbigeoService } from "../services/ubigeo.service";
@Module({
    controllers: [UbigeoController],
    providers: [UbigeoService, UbigeoSeeder, UbigeoRepository],
    exports: [UbigeoSeeder],
})
export class UbigeoModule {}
