import {
    type FiltersPaginator,
    generateCodeEntity,
    paginator,
} from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import type { UserAuth } from "@modules/user/schemas/user.schema";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { count, desc, eq, ilike } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { IconStoreDto, IconUpdateDto } from "../dtos/icon.dto";
import { iconEntity } from "../entities/icon.entity";
import type { IconSchema } from "../schemas/icon.schema";

@Injectable()
export class IconService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
        @Inject(CACHE_MANAGER) private cache: Cache
    ) {}
    async index(filters: FiltersPaginator<IconSchema>) {
        const data = await paginator("icon", {
            filters,
            cb: async (props) => {
                const { search, limit, offset } = props;

                const whereClause = search
                    ? ilike(iconEntity.name, `%${search}%`)
                    : undefined;

                const result = await Promise.all([
                    this.db.query.icon.findMany({
                        limit,
                        offset,
                        with: {
                            user_academic: {
                                columns: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                        orderBy: [desc(schema.icon.id)],
                        where: whereClause,
                    }),
                    this.db
                        .select({ count: count() })
                        .from(iconEntity)
                        .where(whereClause)
                        .then((res) => res[0].count),
                ]);

                return result;
            },
        });
        return data;
    }

    async store(user: UserAuth, data: IconStoreDto) {
        const code = await generateCodeEntity({
            db: this.db,
            Item: schema.icon,
            latestCodeColumn: "code",
            orderByColumn: schema.icon.id,
            prefix: "ICON-",
        });

        const [icon] = await this.db
            .insert(schema.icon)
            .values({
                ...data,
                code,
            })
            .returning();

        await this.cache.del("icons");

        return {
            icon,
        };
    }

    async show(id: number) {
        const icon = await this.db.query.icon.findFirst({
            where: eq(schema.icon.id, id),
            with: {
                user_academic: {
                    columns: { id: true, username: true },
                },
            },
        });

        if (!icon) {
            throw new Error(`No se encontró el icono con id ${id}`);
        }

        return {
            success: true,
            icon,
        };
    }

    async update(user: UserAuth, id: number, data: IconUpdateDto) {
        // Icon.update -> db.update().set().where()
        await this.db
            .update(schema.icon)
            .set({
                ...data,
            })
            .where(eq(schema.icon.id, Number(id)));

        await this.cache.del("icons");

        return {
            success: true,
            message: "Icono actualizado correctamente",
        };
    }

    async destroy(id: number) {
        await this.db.delete(schema.icon).where(eq(schema.icon.id, id));
        await this.cache.del("icons");

        return {
            success: true,
            message: "Icono eliminado correctamente",
        };
    }
}
