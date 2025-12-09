import util from "node:util";
import stream from "node:stream";
import { createWriteStream } from "node:fs";
import { Op, Transaction } from "sequelize";
import { Model } from "sequelize-typescript";
import cache from "@vigilio/express-core/cache";

const pipeline = util.promisify(stream.pipeline);

/*** random number between*/
export function randomNumber(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export async function downloadFileFetch(url: string, rutaArchivo: string) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        if (res.body) {
            await pipeline(
                res.body as unknown as stream.Readable,
                createWriteStream(rutaArchivo)
            );
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

// JWT

// export function generarTokenJWT<T extends string | Buffer | object>(
//     payload: T,
//     options?: jwt.SignOptions
// ): string {
//     const token = jwt.sign(payload, enviroments.JWT_KEY, options);
//     return token;
// }
// export function generarTokensJWT(id: number) {
//     const EXPIRES_IN_ACCESS_TOKEN = "24h";
//     const EXPIRES_IN_REFRESH_TOKEN = "7d";

//     const access_token = jwt.sign({ id }, enviroments.JWT_KEY, {
//         expiresIn: EXPIRES_IN_ACCESS_TOKEN,
//     });

//     const refresh_token = jwt.sign({ id }, enviroments.JWT_KEY, {
//         expiresIn: EXPIRES_IN_REFRESH_TOKEN,
//     });

//     return { access_token, refresh_token };
// }

// export function verificarTokenJWT<T>(
//     token: string,
//     options?: jwt.VerifyOptions & {
//         complete?: false;
//     }
// ): T {
//     try {
//         const decoded = jwt.verify(token, enviroments.JWT_KEY, options);
//         return decoded as T;
//     } catch (error) {
//         throw new Error("Token inválido o expirado.");
//     }
// }
export function formatPrice(numero: number) {
    return numero.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
export type Money = "USD" | "PEN";
export function isPEN(typeMoney: Money, pen: number, usd: number) {
    return formatPrice(typeMoney === "PEN" ? pen : usd);
}

export function getOS(userAgent: string) {
    let os = "Unknown OS";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS")) os = "Mac OS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
        os = "iOS";
    return os;
}

export function getBrowser(userAgent: string) {
    let browser = "Desconocido";

    if (/edg/i.test(userAgent)) {
        browser = "Edge";
    } else if (/opr|opera/i.test(userAgent)) {
        browser = "Opera";
    } else if (/chrome/i.test(userAgent)) {
        browser = "Chrome";
    } else if (/safari/i.test(userAgent)) {
        browser = "Safari";
    } else if (/firefox/i.test(userAgent)) {
        browser = "Firefox";
    } else if (/msie|trident/i.test(userAgent)) {
        browser = "Internet Explorer";
    }
    return browser;
}

// obtiene informacion address,etc con una ip. guardar cache a ip que ya existe
export async function getInformationWithIP(ip: string) {
    let country: string | null = null;
    let city: string | null = null;
    const ips: [string, string][] = JSON.parse(cache.get("ips") || "[]");
    const findIp = ips.find(([ipb]) => ipb === ip);
    if (!findIp) {
        const response = await fetch(`https://ipapi.co/${ip}/json`);

        const result = (await response.json()) as {
            ip: string;
            network: string;
            version: string;
            city: string;
            region: string;
            region_code: string;
            country: string;
            country_name: string;
            country_code: string;
            country_code_iso3: string;
            country_capital: string;
            country_tld: string;
            continent_code: string;
            in_eu: boolean;
            postal: unknown;
            latitude: number;
            longitude: number;
            timezone: string;
            utc_offset: string;
            country_calling_code: string;
            currency: string;
            currency_name: string;
            languages: string;
            country_area: number;
            country_population: number;
            asn: string;
            org: string;
        };

        if (result.ip) {
            country = result.country.toUpperCase();
            city = result.city.toUpperCase();
        } else {
            const response = await fetch(`https://ipwhois.app/json/${ip}`);
            const result = (await response.json()) as {
                ip: string;
                success: boolean;
                type: string;
                continent: string;
                continent_code: string;
                country: string;
                country_code: string;
                country_flag: string;
                country_capital: string;
                country_phone: string;
                country_neighbours: string;
                region: string;
                city: string;
                latitude: number;
                longitude: number;
                asn: string;
                org: string;
                isp: string;
                timezone: string;
                timezone_name: string;
                timezone_dstOffset: number;
                timezone_gmtOffset: number;
                timezone_gmt: string;
                currency: string;
                currency_code: string;
                currency_symbol: string;
                currency_rates: number;
                currency_plural: string;
            };
            if (result.success) {
                country = result.country.toUpperCase();
                city = result.city.toUpperCase();
            } else {
                const response = await fetch(`https://ipinfo.io/${ip}/json`);
                const result = (await response.json()) as {
                    ip: string;
                    hostname: string;
                    city: string;
                    region: string;
                    country: string;
                    loc: string;
                    org: string;
                    postal: string;
                    timezone: string;
                    readme: string;
                };
                country = result.country.toUpperCase();
                city = result.city.toUpperCase();
            }
        }
        //24h
        const secondsInOneWeek = 7 * 24 * 60 * 60;
        cache.set(
            "ips",
            JSON.stringify([...ips, [ip, `${country} - ${city}`]]),
            secondsInOneWeek
        );
    }

    return findIp ? findIp[1] : `${country} - ${city}`;
}

function getPeruDate(date: Date) {
    const offset = 5 * 60 * 60 * 1000; // +5 horas para compensar UTC-5
    return new Date(date.getTime() - offset);
}

export type DateChoose = "day" | "week" | "month" | "month6" | "year";
export function whereTime() {
    const now = new Date();

    const dateRanges: Record<DateChoose, { start: Date; end: Date }> = {
        day: {
            start: getPeruDate(
                new Date(now.getFullYear(), now.getMonth(), now.getDate())
            ),
            end: getPeruDate(
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    23,
                    59,
                    59,
                    999
                )
            ),
        },
        week: {
            start: (() => {
                const dayOfWeek = now.getDay();
                const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                return getPeruDate(
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() - diffToMonday
                    )
                );
            })(),
            end: (() => {
                const dayOfWeek = now.getDay();
                const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                return getPeruDate(
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() + (6 - diffToMonday),
                        23,
                        59,
                        59,
                        999
                    )
                );
            })(),
        },
        month: {
            start: getPeruDate(new Date(now.getFullYear(), now.getMonth(), 1)),
            end: getPeruDate(
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                )
            ),
        },
        month6: {
            start: getPeruDate(
                new Date(now.getFullYear(), now.getMonth() - 5, 1)
            ),
            end: getPeruDate(
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                )
            ),
        },
        year: {
            start: getPeruDate(new Date(now.getFullYear(), 0, 1)),
            end: getPeruDate(
                new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
            ),
        },
    };
    return dateRanges;
}
export function dateToISO(date: Date | string | number) {
    return new Date(date).toISOString() as unknown as Date;
}
export async function generateCodeEntity(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

        code = incrementCode(numericPart);
    } else {
        code = "000001"; // Código inicial
    }

    return `${prefix}${code}`; // Combina el prefijo con el código numérico
}

export function incrementCode(code: string, increment = 1) {
    const ultimoNumero = Number.parseInt(code.replace(/\D/g, ""));
    return `${String(ultimoNumero + increment).padStart(6, "0")}`;
}
export async function verifyRepeatAttribute<T extends object>(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    Item: any,
    body: T,
    attributes: (keyof T)[] | keyof T,
    id: number | null = null,
    t?: Transaction
) {
    let where = {};

    if (id) {
        where = {
            id: { [Op.not]: id },
        };
    }
    const attr: string[] =
        typeof attributes === "string"
            ? [attributes]
            : (attributes as string[]);

    for (const attribute of attr) {
        where = {
            ...where,
            [attribute]: body[attribute as keyof typeof body],
        };
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const count = await (Item as any).unscoped().count({
        where,
        paranoid: false,
        ...t,
    });
    return attr.length > 1
        ? count > 0
        : !body[attr[0] as keyof typeof body]
        ? false
        : count > 0;
}

// BULKCREATE PARA envio masivo de datos. muy util adios await Promise.all
type BulkCreateConfig<T extends object, E extends object> = {
    model: typeof Model<T, T>;
    data: E[];
    excludeFields?: (keyof E)[];
    beforeCreate?: (
        item: Omit<E, "id">,
        index: number,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

/**
 * 
 const createdPages = await bulkCreateWithNestedRelations<PageModel, GridBannerModel, BannerItemModel>(
    {
        model: Page,
        data: body.pages,
        excludeFields: ['id', 'created_at', 'updated_at'],
        beforeCreate: (page) => ({
            ...page,
            empresa_id: empresa!.id
        }),
        chunkSize: 500
    },
    [
        {
            relationField: 'page_id',
            childrenField: 'grid_banners',
            config: {
                model: GridBanner,
                excludeFields: ['id', 'created_at', 'updated_at'],
                beforeCreate: (banner) => ({
                    ...banner,
                    empresa_id: empresa!.id
                })
            }
        },
        {
            relationField: 'grid_banner_id',
            childrenField: 'banner_items',
            config: {
                model: BannerItem,
                excludeFields: ['id', 'created_at', 'updated_at']
            }
        }
    ]
);
 */
export async function bulkCreateWithNestedRelations<
    T extends object,
    E extends object,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            BulkCreateConfig<D, any>,
            "data" | "model" | "transaction"
        >
    ): Promise<Array<D & { id: number }>> => {
        const results: Array<D & { id: number }> = [];

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        relationConfig: RelationConfig<P, any, C>,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        childConfig: BulkCreateConfig<C, any>
    ) => {
        const childrenToCreate: C[] = [];
        for (const [i, parentItem] of parentData.entries()) {
            const parentResult = parentResults[i];
            const children =
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (parentItem as any)[relationConfig.childrenField] || [];

            for (const [index, child] of children.entries()) {
                let childData = { ...child };

                if (childConfig.excludeFields) {
                    for (const field of childConfig.excludeFields) {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        delete (childData as any)[field];
                    }
                }

                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                delete (itemData as any)[field];
            }
        }

        return mainConfig.beforeCreate
            ? mainConfig.beforeCreate(itemData as Omit<E, "id">, index, null)
            : (itemData as Omit<T, "id">);
    });

    const mainResults = await processInChunks(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (mainConfig as any).model,
        mainData as Omit<T, "id">[]
    );

    // Process nested relations
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let currentParents: any[] = mainConfig.data;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let currentResults: any[] = mainResults;

    for (const relation of relations) {
        const childResults = await createLevel(
            currentParents,
            currentResults,
            relation,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            relation.config as BulkCreateConfig<any, any>
        );

        // Update for next level
        currentParents = currentParents.flatMap(
            (parent) =>
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (parent[(relation as any).childrenField] as object[]) || []
        );
        currentResults = childResults;
    }

    return mainResults;
}

export type FiltersPaginator<T extends object> = {
    limit?: string;
    offset?: string;
    search?: string;
} & {
    filters: {
        [P in keyof T]?: T[P] extends number
            ? { min: number; max: number }
            : T[P] extends Date | undefined
            ? { from?: string; to?: string; label?: string; preset?: string }
            : T[P];
    };
};

export interface PaginatorOptions<T extends object> {
    filters?: FiltersPaginator<T>;
    cb: (
        filters: FiltersPaginator<T> & { limit: number; offset: number }
    ) => Promise<[unknown[], number]>;
}
export type PaginatorResult<T extends object> = FiltersPaginator<T> & {
    limit: number;
    offset: number;
};
export async function paginator<T extends object>(
    model: string,
    options: PaginatorOptions<T>
) {
    const { cb, filters } = options;
    const {
        offset = "0",
        limit = "20",
        search = "",
        filters: filtersPaginator,
        ...rest
    } = filters as FiltersPaginator<T>;

    const offsetConverted = Number(offset);
    const limitConverted = Number(limit);
    const searchConverted = search || "";

    const [results, count] = await cb({
        offset: offsetConverted,
        limit: limitConverted,
        search: searchConverted,
        filters: JSON.parse((filtersPaginator as unknown as string) || "{}"),
        ...rest,
    } as PaginatorResult<T>);

    const next = `/api/${model}?offset=${
        offsetConverted + limitConverted
    }&limit=${limitConverted}`;
    const offsetTotal = offsetConverted - limitConverted;
    const back = `/api/${model}?offset=${offsetTotal}&limit=${limitConverted}`;

    return {
        success: true,
        count,
        next,
        previous: offsetTotal >= 0 ? back : null,
        results,
    };
}

/**
 *      xs:      60 * 1,          // 1 minuto
 *      sm:      60 * 10,         // 10 minutos
 *      md:      60 * 30,         // 30 minutos
 *      lg:      60 * 60,         // 1 hora
 *      xl:      60 * 60 * 4,     // 4 horas
 *      xxl:     60 * 60 * 24,    // 24 horas (1 día)
 *      xxxl:    60 * 60 * 24 * 3,// 3 días
 *      xxxxl:   60 * 60 * 24 * 7,// 7 días
 *      xxxxxl:  60 * 60 * 24 * 30// 30 días
 */
export const cacheTimes = {
    minute: 60 * 1, //1 minuto
    minutes10: 60 * 10, //10 minutos
    minutes30: 60 * 30, //30 minutos
    hour: 60 * 60, //1 hora
    hours4: 60 * 60 * 4, //4 horas
    days1: 60 * 60 * 24, //8 horas
    days3: 60 * 60 * 24 * 3, //3 dias
    days7: 60 * 60 * 24 * 7, //7 dias
    days30: 60 * 60 * 24 * 30, //30 dias
};

export function cacheGetJson<T>(key: string): T | null {
    const value = cache.get(key);
    if (!value) return null;

    try {
        return JSON.parse(value) as T;
    } catch (err) {
        return null;
    }
}
export async function getByIdCache<T>(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    model: any,
    idValue: string | number,
    searchFields: string[]
): Promise<string | null> {
    // 1️⃣ Intentamos usar cache por id
    let cachedObj = cache.get(`${model.name.toLowerCase()}_id:${idValue}`) as
        | string
        | null;

    if (!cachedObj) {
        let id = idValue;
        if (!Number.isNaN(idValue)) {
            id = Number.parseInt(idValue as string);
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
        cache.set(
            `${model.name.toLowerCase()}_id:${idValue}`,
            cachedObj as string,
            cacheTimes.days7 * 2
        );
    }

    return cachedObj;
}
export type TimeTable =
    | "all"
    | "year"
    | "month"
    | "week"
    | "today"
    | "yesterday";

// export function sorteByTime(empresa: EmpresaEntity, time: TimeTable) {
//     const {
//         startOfToday,
//         endOfToday,
//         startOfWeek,
//         endOfWeek,
//         startOfMonth,
//         endOfMonth,
//         startOfYear,
//         endOfYear,
//         startOfYesterday,
//         endOfYesterday,
//     } = getTime(empresa);
//     let where: WhereOptions = {};

//     if (time === "today") {
//         where = {
//             created_at: {
//                 [Op.between]: [startOfToday, endOfToday],
//             },
//         };
//     }
//     if (time === "week") {
//         where = {
//             created_at: {
//                 [Op.between]: [startOfWeek, endOfWeek],
//             },
//         };
//     }
//     if (time === "month") {
//         where = {
//             created_at: {
//                 [Op.between]: [startOfMonth, endOfMonth],
//             },
//         };
//     }
//     if (time === "year") {
//         where = {
//             created_at: {
//                 [Op.between]: [startOfYear, endOfYear],
//             },
//         };
//     }
//     if (time === "yesterday") {
//         where = {
//             created_at: {
//                 [Op.between]: [startOfYesterday, endOfYesterday],
//             },
//         };
//     }
//     return where;
// }

// export function getTime(empresa: EmpresaSchemaFromServer) {
//     const day = dayjs().tz(empresa.timezone);
//     const currentYear = day.year();
//     const currentMonth = day.month() + 1;
//     const startOfYear = day.startOf("year").utc().format();
//     const endOfYear = day.endOf("year").utc().format();
//     const startOfToday = day.startOf("day").utc().format();
//     const endOfToday = day.endOf("day").utc().format();
//     const startOfWeek = day.startOf("week").utc().format();
//     const endOfWeek = day.endOf("week").utc().format();
//     const startOfMonth = day.startOf("month").utc().format();
//     const endOfMonth = day.endOf("month").utc().format();
//     const startOfYesterday = day
//         .subtract(1, "day")
//         .startOf("day")
//         .utc()
//         .format();
//     const endOfYesterday = day.subtract(1, "day").endOf("day").utc().format();

//     return {
//         currentYear,
//         currentMonth,
//         startOfYear,
//         endOfYear,
//         startOfToday,
//         endOfToday,
//         startOfWeek,
//         endOfWeek,
//         startOfMonth,
//         endOfMonth,
//         startOfYesterday,
//         endOfYesterday,
//     };
// }
