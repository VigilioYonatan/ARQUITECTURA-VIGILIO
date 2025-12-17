import { generateId, slugify } from "@infrastructure/libs";
import { generateCodeEntity } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { UserStoreDto, UserUpdateDto } from "../dtos/user.dto";
import { userEntity } from "../entities/user.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async index() {
        const result = await this.db.query.user.findMany();
        return {
            data: result,
        };
    }

    async show(id: number) {
        const user = await this.db.query.user.findFirst({
            where: eq(userEntity.id, id),
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.db.query.user.findFirst({
            where: eq(userEntity.email, email),
        });
        if (!user)
            throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }

    async store(body: UserStoreDto) {
        const code = await generateCodeEntity({
            db: this.db,
            Item: userEntity,
            latestCodeColumn: "code",
            orderByColumn: userEntity.id,
            prefix: "USER-",
        });
        const slug = slugify(
            body.user_name ||
                `${body.full_name}${body.father_lastname}${generateId().slice(
                    4
                )}`
        );
        const user = await this.db
            .insert(userEntity)
            .values({
                ...body,
                code,
                slug,
                intentos_session: 0,
                enabled_notifications_webpush: true,
            })
            .returning(); // Added returning to get the inserted user usually
        return user[0];
    }

    async update(id: number, body: UserUpdateDto) {
        await this.db.update(userEntity).set(body).where(eq(userEntity.id, id));
        return {
            message: "User updated successfully",
        };
    }

    async destroy(id: number) {
        await this.db.delete(userEntity).where(eq(userEntity.id, id));
        return {
            message: "User deleted successfully",
        };
    }
}
