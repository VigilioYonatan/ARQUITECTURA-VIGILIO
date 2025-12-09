import { DatabaseModule } from "@infrastructure/providers/database/database.module";
import { Module } from "@nestjs/common";
import { SeederController } from "./seeder.controller";
import { SeederService } from "./seeder.service";

@Module({
    imports: [DatabaseModule],
    controllers: [SeederController],
    providers: [SeederService],
    exports: [SeederService],
})
export class SeederModule {}
