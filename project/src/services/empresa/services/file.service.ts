import { Injectable, NotFoundException } from "@vigilio/express-core";
import {
    FiltersPaginator,
    paginator,
} from "@/infrastructure/libs/server/helpers";
import { Op, WhereOptions } from "sequelize";
import { FileSchema } from "../schemas/file.schema";
import { Inject } from "@nestjs/common";
import { FILE_REPOSITORY } from "../providers/file.provider";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserAuth } from "@/user/schemas/user.schema";
import { FileStoreDto } from "../dtos/file.dto";
import { FileEntity } from "../entities/file.entity";

@Injectable()
export class FileService {
    constructor(
        @Inject(FILE_REPOSITORY) private fileRepository: typeof FileEntity,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
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
        this.cacheManager.delete("files");
        return {
            success: true,
            file,
        };
    }
    async show(id: string) {
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
    async destroy(id: string) {
        const { file } = await this.show(id);
        // if (file.file) {
        //     await removeFile(file.file);
        // }
        // if (file.history.length) {
        //     for (const element of file.history) {
        //         await removeFile([{ name: element, file: element, size: 0 }]);
        //     }
        // }
        await file.destroy();
        this.cacheManager.delete("files");
        return {
            success: true,
            message: "Archivo eliminado correctamente.",
        };
    }
}
