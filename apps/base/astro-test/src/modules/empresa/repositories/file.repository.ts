import { type PaginatorResult } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import type { FilesSchema } from "@modules/uploads/schemas/upload.schema";
import { Inject, Injectable } from "@nestjs/common";
import { and, eq, gte, like, lte, type SQL, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { FileSchema } from "../schemas/file.schema";

@Injectable()
export class FileRepository {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async findAndCount(filters: PaginatorResult<FileSchema>) {
        const { limit, offset, search, filters: filterOptions } = filters;
        const conditions: SQL[] = [];
        if (search) {
            conditions.push(like(schema.file.name, `%${search}%`));
        }
        if (filterOptions?.created_at) {
            conditions.push(
                and(
                    gte(
                        schema.file.created_at,
                        new Date(filterOptions.created_at.from!)
                    ),
                    lte(
                        schema.file.created_at,
                        new Date(filterOptions.created_at.to!)
                    )
                )!
            );
        }
        const whereClause = and(...conditions);

        return Promise.all([
            this.db
                .select()
                .from(schema.file)
                .where(whereClause)
                .limit(limit)
                .offset(offset)
                .orderBy(schema.file.id),
            this.db
                .select({ count: sql<number>`count(*)` })
                .from(schema.file)
                .where(whereClause)
                .limit(1)
                .then((res) => res[0].count),
        ]);
    }

    async create(data: { name: string; file: FilesSchema[]; user_id: number }) {
        return this.db
            .insert(schema.file)
            .values({
                name: data.name,
                file: data.file,
                user_id: data.user_id,
                history: [],
            })
            .returning()
            .then((res) => res[0]);
    }

    async findById(id: number) {
        return this.db
            .select()
            .from(schema.file)
            .where(eq(schema.file.id, id))
            .limit(1)
            .then((res) => res[0]);
    }

    async delete(id: number) {
        return this.db.delete(schema.file).where(eq(schema.file.id, id));
    }
}
