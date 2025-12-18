import { AddressSeeder } from "@modules/empresa/seeders/adress.seeder";
import { EmpresaSeeder } from "@modules/empresa/seeders/empresa.seeder";
import { UbigeoSeeder } from "@modules/ubigeo/seeder/ubigeo.seeder";
import { UserSeeder } from "@modules/users/seeders/user.seeder";
import { Module } from "@nestjs/common";
import { AppModule } from "@src/app.module";
import { SeederService } from "./seeder.service";

@Module({
    imports: [AppModule],
    providers: [
        SeederService,
        UbigeoSeeder,
        EmpresaSeeder,
        UserSeeder,
        AddressSeeder,
    ],
})
export class SeederModule {}
