/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { Injectable } from "@nestjs/common";
import type { Transaction } from "sequelize";
import type { Model } from "sequelize-typescript";

type BulkCreateConfig<T extends object, E extends object> = {
    model: typeof Model<T, T>;
    data: E[];
    excludeFields?: (keyof E)[];
    beforeCreate?: (
        item: Omit<E, "id">,
        index: number,
        parent: any
    ) => Omit<T, "id">;
    transaction?: Transaction;
    chunkSize?: number;
};

type RelationConfig<T extends object, E extends object, C extends object> = {
    relationField: keyof T;
    childrenField: keyof E;
    config: Omit<BulkCreateConfig<T, C>, "data" | "transaction">;
};
@Injectable()
export class DatabaseService {
    async generateCodeEntity(
        Item: any,
        latestCode: string,
        prefix = "", // Nuevo parámetro para el prefijo (ej: "USER-", "ALM-")
        t?: Transaction
    ) {
        const transactions = t ? { transaction: t } : {};
        const latestUser = await Item.unscoped().findOne({
            order: [["id", "DESC"]],
            attributes: [latestCode],
            raw: true,
            paranoid: false,
            ...transactions,
        });

        let code: string | null = null;
        if (latestUser) {
            // Extrae solo la parte numérica del código existente (por si ya tiene prefijo)
            const numericPart = latestUser[latestCode]; // Elimina todo lo que no sea número
            // console.log({ numericPart });

            code = this.incrementCode(numericPart);
        } else {
            code = "000001"; // Código inicial
        }

        return `${prefix}${code}`; // Combina el prefijo con el código numérico
    }

    incrementCode(code: string, increment = 1) {
        const ultimoNumero = Number.parseInt(code.replace(/\D/g, ""), 10);
        return `${String(ultimoNumero + increment).padStart(6, "0")}`;
    }

    // sirve pára optmizar los bulk, mejora de rendimiento
    async bulkCreateWithNestedRelations<
        T extends object,
        E extends object,
        R extends RelationConfig<any, any, any>[]
    >(
        mainConfig: BulkCreateConfig<T, E>,
        relations: R,
        options: { transaction?: Transaction } = {}
    ) {
        const transaction = options.transaction;
        const chunkSize = mainConfig.chunkSize || 1000;

        const processInChunks = async <D extends object>(
            model: typeof Model<D, D>,
            data: D[],
            config?: Omit<
                BulkCreateConfig<D, any>,
                "data" | "model" | "transaction"
            >
        ): Promise<Array<D & { id: number }>> => {
            const results: Array<D & { id: number }> = [];

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);
                const created = await (model as any).bulkCreate(chunk, {
                    transaction,
                    returning: true,
                    ...config,
                });
                results.push(...created);
            }

            return results;
        };

        const createLevel = async <P extends object, C extends object>(
            parentData: P[],
            parentResults: Array<P & { id: number }>,
            relationConfig: RelationConfig<P, any, C>,
            childConfig: BulkCreateConfig<C, any>
        ) => {
            const childrenToCreate: C[] = [];
            for (const [i, parentItem] of parentData.entries()) {
                const parentResult = parentResults[i];
                const children =
                    (parentItem as any)[relationConfig.childrenField] || [];

                for (const [index, child] of children.entries()) {
                    let childData = { ...child };

                    if (childConfig.excludeFields) {
                        for (const field of childConfig.excludeFields) {
                            delete (childData as any)[field];
                        }
                    }

                    (childData as any)[relationConfig.relationField] =
                        parentResult.id;

                    if (childConfig.beforeCreate) {
                        childData = childConfig.beforeCreate(
                            childData as Omit<C, "id">,
                            index,
                            parentResult // Pasamos el parentResult aquí
                        ) as C;
                    }

                    childrenToCreate.push(childData);
                }
            }

            if (childrenToCreate.length > 0) {
                return processInChunks(
                    childConfig.model,
                    childrenToCreate,
                    childConfig
                );
            }

            return [];
        };

        // Process main data
        const mainData = mainConfig.data.map((item, index) => {
            const itemData = { ...item };

            if (mainConfig.excludeFields) {
                for (const field of mainConfig.excludeFields) {
                    delete (itemData as any)[field];
                }
            }

            return mainConfig.beforeCreate
                ? mainConfig.beforeCreate(
                      itemData as Omit<E, "id">,
                      index,
                      null
                  )
                : (itemData as Omit<T, "id">);
        });

        const mainResults = await processInChunks(
            (mainConfig as any).model,
            mainData as Omit<T, "id">[]
        );

        // Process nested relations
        let currentParents: any[] = mainConfig.data;
        let currentResults: any[] = mainResults;

        for (const relation of relations) {
            const childResults = await createLevel(
                currentParents,
                currentResults,
                relation,
                relation.config as BulkCreateConfig<any, any>
            );

            // Update for next level
            currentParents = currentParents.flatMap(
                (parent) =>
                    (parent[(relation as any).childrenField] as object[]) || []
            );
            currentResults = childResults;
        }

        return mainResults;
    }
}
