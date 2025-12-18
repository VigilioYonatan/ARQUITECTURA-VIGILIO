import { cacheTimes } from "@infrastructure/libs/server/helpers";
import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { eq, isNull, or, sql } from "drizzle-orm"; // Operadores de Drizzle
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import type { schema } from "../database/database.schema";

@Injectable()
export class CacheService {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

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
    async getByIdCache(
        tableSchema: PgTableWithColumns<any>,
        idValue: string | number,
        searchFields: string[]
    ): Promise<string | null> {
        const tableName = tableSchema.meta.name;
        const cacheKey = `${tableName.toLowerCase()}_id:${idValue}`;

        //  Intentamos usar cache por id
        const cachedId = await this.cache.get<string>(cacheKey);
        if (cachedId) return cachedId;

        // --- Lógica de Búsqueda en DB (Drizzle) ---
        let idAsNumber: number | string = idValue;
        if (!Number.isNaN(Number(idValue))) {
            idAsNumber = Number(idValue);
        }

        // 2️⃣ Construcción de la cláusula WHERE con Op.or (operador 'or' de Drizzle)
        const conditions = searchFields
            .map((field) => {
                const tableColumn = tableSchema[field];

                if (!tableColumn) {
                    // biome-ignore lint/suspicious/noConsole: <explanation>
                    console.warn(
                        `Field '${field}' not found in Drizzle schema for table '${tableName}'. Skipping.`
                    );
                    return isNull(sql`1`); // Devuelve una condición falsa si el campo no existe
                }

                // Drizzle usa 'eq' (equals)
                if (field === "id") {
                    // Si el ID es válido numéricamente, lo buscamos. Si no, lo buscamos como 0 para fallar.
                    const finalId = Number.isNaN(Number(idValue))
                        ? 0
                        : idAsNumber;
                    return eq(tableColumn, finalId);
                }

                // Para otros campos (slug, code), buscamos el valor tal cual
                return eq(tableColumn, idValue as string);
            })
            .filter((cond) => !isNull(cond)); // Filtra condiciones que no se pudieron generar

        const whereClause = or(...conditions);

        // 3️⃣ Buscar en DB por id, slug o code
        const [dbResult] = await this.db
            .select({ id: tableSchema.id }) // SELECT id
            .from(tableSchema)
            .where(whereClause)
            .limit(1);

        if (!dbResult) return null;

        const foundId = dbResult.id.toString();

        await this.cache.set(cacheKey, foundId, cacheTimes.days7);

        return foundId;
    }
    // --- HEALTH CHECK ---
    async checkHealth(): Promise<boolean> {
        try {
            await this.cache.set("health_check", "ok", 1000);
            const result = await this.cache.get("health_check");
            return result === "ok";
        } catch (error) {
            // biome-ignore lint/suspicious/noConsole: Health check log
            console.error("Redis Health Check Failed:", error);
            return false;
        }
    }
}
