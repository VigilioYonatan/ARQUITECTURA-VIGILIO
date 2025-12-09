import { generateId, slugify } from "@infrastructure/libs";
import { generateCodeEntity } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { UserStoreDto, UserUpdateDto } from "../dto/user.dto";
import { userEntity } from "../entities/user.entity"; // Restore entity import

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE)
        private readonly db: NodePgDatabase<{ user: typeof userEntity }>
    ) {}

    async index() {
        const result = await this.db.query.user.findMany();
        return {
            data: result,
        };
    }

    async store(body: UserStoreDto) {
        const code = await generateCodeEntity({
            db: this.db,
            Item: userEntity, // changed from schema.user
            latestCodeColumn: "code",
            orderByColumn: userEntity.id, // changed from schema.user.id
            prefix: "USER-",
        });
        const slug = slugify(
            body.user_name ||
                `${body.full_name}${body.father_lastname}${generateId().slice(
                    4
                )}`
        );
        const user = await this.db.insert(userEntity).values({
            // changed from schema.user
            ...body,
            code,
            slug,
            intentos_session: 0,
            enabled_notifications_webpush: true,
        });
        return user;
    }

    async show(id: number) {
        const user = await this.db.query.user.findFirst({
            where: eq(userEntity.id, Number(id)), // changed from schema.user.id
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async update(id: number, userUpdateDto: UserUpdateDto) {
        await this.db
            .update(userEntity) // changed from schema.user
            .set(userUpdateDto)
            .where(eq(userEntity.id, id)); // changed from schema.user.id
        return {
            message: "User updated successfully",
        };
    }

    async destroy(id: number) {
        await this.db
            .delete(userEntity) // changed from schema.user
            .where(eq(userEntity.id, id)); // changed from schema.user.id
        return {
            message: "User deleted successfully",
        };
    }
}
