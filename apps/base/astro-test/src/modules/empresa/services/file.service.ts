import type { PaginatorResult } from "@infrastructure/libs/server/helpers";
import { RustFSService } from "@infrastructure/providers/storage/rustfs.service";
import type { UserAuth } from "@modules/users/schemas/user.schema";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { FileStoreDto } from "../dtos/file.dto";
import { FileRepository } from "../repositories/file.repository";
import type { FileSchema } from "../schemas/file.schema";

@Injectable()
export class FileService {
    constructor(
        private readonly fileRepository: FileRepository,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly rustFSService: RustFSService
    ) {}

    async index(filters: PaginatorResult<FileSchema>) {
        return this.fileRepository.findAndCount(filters);
    }

    async store(user: UserAuth, body: FileStoreDto) {
        const file = await this.fileRepository.create({
            name: body.name,
            file: body.file,
            user_id: user.id,
        });

        await this.cache.del("files");
        return {
            file,
        };
    }

    async show(id: number | string) {
        const file = await this.fileRepository.findById(Number(id));

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
            await this.rustFSService.removeFile(file.file);
        }
        if (file.history?.length) {
            for (const element of file.history) {
                await this.rustFSService.removeFile([
                    { name: element, key: element, size: 0, mimetype: "" },
                ]);
            }
        }
        await this.fileRepository.delete(file.id);
        await this.cache.del("files");
        return {
            message: "Eliminado Correctamente.",
        };
    }
}
