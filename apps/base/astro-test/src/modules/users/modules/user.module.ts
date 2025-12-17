import { Module } from "@nestjs/common";
import { UserCacheService } from "../cache/user.cache";
import { UserController } from "../controllers/user.controller";
import { UsersRepository } from "../repositories/users.repository";
import { UserService } from "../services/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService, UsersRepository, UserCacheService],
    exports: [UserService, UsersRepository, UserCacheService],
})
export class UserModule {}
