import { Injectable } from "@nestjs/common";
import { UserCacheService } from "../cache/user.cache";
import type { UserStoreDto, UserUpdateDto } from "../dtos/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly userCacheService: UserCacheService) {}

    async index() {
        return await this.userCacheService.index();
    }

    async store(body: UserStoreDto) {
        return await this.userCacheService.store(body);
    }

    async show(id: number) {
        return await this.userCacheService.show(id);
    }

    async update(id: number, userUpdateDto: UserUpdateDto) {
        return await this.userCacheService.update(id, userUpdateDto);
    }

    async destroy(id: number) {
        return await this.userCacheService.destroy(id);
    }
}
