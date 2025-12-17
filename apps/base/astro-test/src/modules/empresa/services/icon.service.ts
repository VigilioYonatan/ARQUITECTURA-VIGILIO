import {
    type FiltersPaginator,
    paginator,
} from "@infrastructure/libs/server/helpers";
import type { UserAuth } from "@modules/users/schemas/user.schema";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { IconStoreDto, IconUpdateDto } from "../dtos/icon.dto";
import { IconRepository } from "../repositories/icon.repository";
import type { IconSchema } from "../schemas/icon.schema";

@Injectable()
export class IconService {
    constructor(
        private readonly iconRepository: IconRepository,
        @Inject(CACHE_MANAGER) private cache: Cache
    ) {}
    async index(filters: FiltersPaginator<IconSchema>) {
        const data = await paginator("icon", {
            filters,
            cb: async (props) => {
                return this.iconRepository.findAndCount(props);
            },
        });
        return data;
    }

    async store(user: UserAuth, data: IconStoreDto) {
        const icon = await this.iconRepository.create(data);

        await this.cache.del("icons");

        return {
            icon,
        };
    }

    async show(id: number) {
        const icon = await this.iconRepository.findById(id);

        if (!icon) {
            throw new Error(`No se encontró el icono con id ${id}`);
        }

        return {
            success: true,
            icon,
        };
    }

    async update(user: UserAuth, id: number, data: IconUpdateDto) {
        await this.iconRepository.update(id, data);

        await this.cache.del("icons");

        return {
            success: true,
            message: "Icono actualizado correctamente",
        };
    }

    async destroy(id: number) {
        await this.iconRepository.delete(id);
        await this.cache.del("icons");

        return {
            success: true,
            message: "Icono eliminado correctamente",
        };
    }
}
