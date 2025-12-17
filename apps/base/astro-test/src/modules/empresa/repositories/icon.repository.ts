import {
    type FiltersPaginator,
    generateCodeEntity,
} from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable } from "@nestjs/common";
import { count, desc, eq, ilike } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { IconStoreDto, IconUpdateDto } from "../dtos/icon.dto";
import { iconEntity } from "../entities/icon.entity";
import type { IconSchema } from "../schemas/icon.schema";

@Injectable()
export class IconRepository {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async findAndCount(
        props: FiltersPaginator<IconSchema> & { limit: number; offset: number }
    ) {
        const { search, limit, offset } = props;

        const whereClause = search
            ? ilike(iconEntity.name, `%${search}%`)
            : undefined;

        return Promise.all([
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
    }

    async create(data: IconStoreDto) {
        const code = await generateCodeEntity({
            db: this.db,
            Item: schema.icon,
            latestCodeColumn: "code",
            orderByColumn: schema.icon.id,
            prefix: "ICON-",
        });

        return this.db
            .insert(schema.icon)
            .values({
                name: data.name,
                // icon: null,
                slug: data.slug,
                photo: data.photo,
                code,
            })
            .returning()
            .then((res) => res[0]);
    }

    async findById(id: number) {
        return this.db.query.icon.findFirst({
            where: eq(schema.icon.id, id),
            with: {
                user_academic: {
                    columns: { id: true, username: true },
                },
            },
        });
    }

    async update(id: number, data: IconUpdateDto) {
        return this.db
            .update(schema.icon)
            .set({ ...data })
            .where(eq(schema.icon.id, id));
    }

    async delete(id: number) {
        return this.db.delete(schema.icon).where(eq(schema.icon.id, id));
    }
}
