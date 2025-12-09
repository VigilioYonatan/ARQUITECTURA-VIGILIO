import {
    type FiltersPaginator,
    paginator,
} from "@infrastructure/libs/server/helpers";
import type { MinioService } from "@infrastructure/providers/storage/minio.service";
import type { UserAuth } from "@modules/user/schemas/user.schema";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { Op, type WhereOptions } from "sequelize";
import type { FileStoreDto } from "../dtos/file.dto";
import type { FileEntity } from "../entities/file.entity";
import { EMPRESA_REPOSITORY } from "../providers/empresa.provider";
import type { FileSchema } from "../schemas/file.schema";

@Injectable()
export class FileService {
    constructor(
        @Inject(EMPRESA_REPOSITORY)
        private readonly fileRepository: typeof FileEntity,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
        private readonly minioService: MinioService
    ) {}
    async index(filters: FiltersPaginator<FileSchema>) {
        const result = await paginator("file", {
            filters,
            cb: async (props) => {
                const { offset, limit, filters, search } = props;
                let where: WhereOptions = {
                    name: {
                        [Op.iLike]: `%${search || ""}%`,
                    },
                };

                if (filters?.created_at) {
                    where = {
                        ...where,
                        created_at: {
                            [Op.gte]: filters.created_at.from,
                            [Op.lte]: filters.created_at.to,
                        },
                    };
                }

                const result = await Promise.all([
                    this.fileRepository.findAll({
                        offset,
                        limit,
                        order: [["id", "ASC"]],
                        where,
                    }),
                    this.fileRepository.count({
                        where,
                    }),
                ]);
                return result;
            },
        });
        return result;
    }
    async store(user: UserAuth, body: FileStoreDto) {
        const file = new this.fileRepository({
            ...body,
            user_id: user.id,
            history: [],
        });
        await file.save();
        await this.cache.del("files");
        return {
            success: true,
            file,
        };
    }
    async show(id: number) {
        const file = await this.fileRepository.findByPk(id);
        if (!file) {
            throw new NotFoundException(
                `No se encontró un archivo con el id ${id}`
            );
        }
        return {
            success: true,
            file,
        };
    }
    async destroy(id: number) {
        const { file } = await this.show(id);
        if (file.file) {
            await this.minioService.removeFile(file.file);
        }
        if (file.history.length) {
            for (const element of file.history) {
                await this.minioService.removeFile([
                    {
                        name: element,
                        key: element,
                        mimetype: "",
                        size: 0,
                    },
                ]);
            }
        }
        await file.destroy();
        await this.cache.del("files");
        return {
            success: true,
            message: "Eliminado Correctamente.",
        };
    }
}
