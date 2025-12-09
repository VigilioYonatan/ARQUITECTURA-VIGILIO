import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { Op } from "sequelize";

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async cacheGetJson<T>(key: string): Promise<T | null> {
        // En NestJS cache-manager, cache.get puede ser asíncrono
        const value = await this.cache.get<string>(key);
        if (!value) return null;

        try {
            // El valor ya debe estar en string si se usó cacheSetJson, pero si se usa sync/async get, mejor castear.
            return JSON.parse(value as unknown as string) as T;
        } catch (err) {
            // biome-ignore lint/suspicious/noConsole: <explanation>
            console.error("Error parsing cached JSON:", err);
            return null;
        }
    }

    // 2️⃣ Función adaptada para Drizzle (getByIdCache)
    /**
     * Busca la ID de una entidad por su ID, slug o code, usando caché de por medio.
     * Si encuentra la ID en la DB, la guarda en caché antes de devolverla.
     * @param tableSchema El objeto de esquema de Drizzle para la tabla (e.g., schema.file)
     * @param idValue El valor a buscar (puede ser ID, slug, o code)
     * @param searchFields Los campos de la tabla a buscar (e.g., ['id', 'slug', 'code'])
     * @returns La ID encontrada como string, o null.
     */
    async getByIdCache<T>(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        model: any,
        idValue: string | number,
        searchFields: string[]
    ): Promise<string | null> {
        // 1️⃣ Intentamos usar cache por id
        let cachedObj = (await this.cache.get(
            `${model.name.toLowerCase()}_id:${idValue}`
        )) as string | null;

        if (!cachedObj) {
            let id = idValue;
            if (!Number.isNaN(idValue)) {
                id = Number.parseInt(idValue as string, 10);
            }

            // 2️⃣ Buscar en DB por id, slug o code
            cachedObj = await model.unscoped().findOne({
                where: {
                    [Op.or]: searchFields.map((field) => ({
                        [field]:
                            field === "id"
                                ? Number.isNaN(id as string)
                                    ? 0
                                    : id
                                : idValue, // solo id se convierte a number
                    })),
                },
                attributes: ["id"],
                raw: true,
            });

            if (!cachedObj) return null;
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            cachedObj = (cachedObj as any).id.toString();
            await this.cache.set(
                `${model.name.toLowerCase()}_id:${idValue}`,
                cachedObj as string,
                cacheTimes.days7 * 2
            );
        }

        return cachedObj;
    }
}
