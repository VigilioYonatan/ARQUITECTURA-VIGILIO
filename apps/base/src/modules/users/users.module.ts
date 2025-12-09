import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DatabaseModule } from "@infrastructure/modules/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
