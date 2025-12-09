import { generateId, slugify } from "@infrastructure/libs";
import type { DatabaseService } from "@infrastructure/providers/database/database.service";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { UserStoreDto, UserUpdateDto } from "../dto/user.dto";
import { UserEntity } from "../entities/user.entity";
import { USER_REPOSITORY } from "../providers/user.provider";
import type { UserAuth } from "../schemas/user.schema";

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: typeof UserEntity,
        private readonly databaseService: DatabaseService
    ) {}

    async index() {
        const result = await this.userRepository.findAll();
        return {
            data: result,
        };
    }

    async store(user: UserAuth | null, body: UserStoreDto) {
        const code = await this.databaseService.generateCodeEntity(
            UserEntity,
            "code",
            "USER-"
        );
        const slug = slugify(
            body.user_name ||
                `${body.full_name}${body.father_lastname}${generateId().slice(
                    -4,
                    4
                )}`
        );
        const usuario = new this.userRepository({
            ...body,
            code,
            user_id: user?.id || null,
            intentos_session: 0,
            slug,
            enabled_notifications_webpush: true,
        });
        await usuario.save();
        return {
            success: true,
            user: usuario,
        };
    }

    async show(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async update(id: number, userUpdateDto: UserUpdateDto) {
        await this.userRepository.update(userUpdateDto, {
            where: {
                id: Number(id),
            },
        });
        return {
            message: "User updated successfully",
        };
    }

    async destroy(id: number) {
        await this.userRepository.destroy({
            where: {
                id: Number(id),
            },
        });
        return {
            message: "User deleted successfully",
        };
    }
}
