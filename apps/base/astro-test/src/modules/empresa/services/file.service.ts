import type { PaginatorResult } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import type { MinioService } from "@infrastructure/providers/storage/minio.service";
import type { UserAuth } from "@modules/user/schemas/user.schema";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, gte, like, lte, SQL, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { FileStoreDto } from "../dtos/file.dto";
import type { FileSchema } from "../schemas/file.schema";

@Injectable()
export class FileService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly minioService: MinioService
    ) {}

    async index(filters: PaginatorResult<FileSchema>) {
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
        const result = await Promise.all([
            this.db
                .select()
                .from(schema.file)
                .where(whereClause)
                .limit(limit)
                .offset(offset)
                .orderBy(schema.file.id), // order: [["id", "ASC"]]
            this.db
                .select({ count: sql<number>`count(*)` })
                .from(schema.file)
                .where(whereClause)
                .limit(1)
                .then((res) => res[0].count), // Optimización
        ]);

        return result;
    }

    async store(user: UserAuth, body: FileStoreDto) {
        const [file] = await this.db
            .insert(schema.file)
            .values({
                ...body,
                user_id: user.id,
                history: [],
            })
            .returning();

        await this.cache.del("files");
        return {
            file,
        };
    }

    async show(id: number | string) {
        const [file] = await this.db
            .select()
            .from(schema.file)
            .where(eq(schema.file.id, Number(id)))
            .limit(1);

        if (!file) {
            throw new NotFoundException(
                `No se encontró un archivo con el id ${id}`
            );
        }
        return {
            file,
        };
    }

    async destroy(id: number | string) {
        const { file } = await this.show(id); // Reusa el método show

        if (file.file) {
            await this.minioService.removeFile(file.file);
        }
        if (file.history?.length) {
            for (const element of file.history) {
                await this.minioService.removeFile([
                    { name: element, key: element, size: 0, mimetype: "" },
                ]);
            }
        }
        await this.db.delete(schema.file).where(eq(schema.file.id, file.id));
        await this.cache.del("files");
        return {
            message: "Eliminado Correctamente.",
        };
    }
}
