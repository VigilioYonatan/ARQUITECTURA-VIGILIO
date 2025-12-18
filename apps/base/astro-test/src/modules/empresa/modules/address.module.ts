import { Module } from "@nestjs/common";
import { AddressSeeder,  } from "../seeders/adress.seeder";

@Module({
    providers: [AddressSeeder],
    exports: [AddressSeeder],
})
export class AddressModule {}
