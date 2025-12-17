import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import type { UserStoreDto, UserUpdateDto } from "../dtos/user.dto";
import { UsersRepository } from "../repositories/users.repository";

@Injectable()
export class UserCacheService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async index() {
        const cacheKey = "users:index";
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const result = await this.usersRepository.index();
        await this.cacheManager.set(cacheKey, result, 10000); // 10s cache for list
        return result;
    }

    async store(body: UserStoreDto) {
        const result = await this.usersRepository.store(body);
        await this.cacheManager.del("users:index");
        return result;
    }

    async show(id: number) {
        const cacheKey = `users:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const user = await this.usersRepository.show(id);
        await this.cacheManager.set(cacheKey, user, 60000); // 60s
        return user;
    }

    async update(id: number, userUpdateDto: UserUpdateDto) {
        const result = await this.usersRepository.update(id, userUpdateDto);
        await this.cacheManager.del(`users:${id}`);
        await this.cacheManager.del("users:index");
        return result;
    }

    async destroy(id: number) {
        const result = await this.usersRepository.destroy(id);
        await this.cacheManager.del(`users:${id}`);
        await this.cacheManager.del("users:index");
        return result;
    }
}
