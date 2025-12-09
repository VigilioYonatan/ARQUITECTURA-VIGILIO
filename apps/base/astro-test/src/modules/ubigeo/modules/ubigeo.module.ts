import { Module } from "@nestjs/common";
import { UbigeoController } from "../controllers/ubigeo.controller";
import { UbigeoSeeder } from "../seeder/ubigeo.seeder";
import { UbigeoService } from "../services/ubigeo.service";
@Module({
    controllers: [UbigeoController],
    providers: [UbigeoService, UbigeoSeeder],
    exports: [UbigeoSeeder],
})
export class UbigeoModule {}
