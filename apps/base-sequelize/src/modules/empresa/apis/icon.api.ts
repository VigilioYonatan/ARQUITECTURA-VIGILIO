// CURSO TYPE

import type { FilterResult } from "@infrastructure/libs/client/helpers";
import type {
    PaginatorResult,
    PaginatorResultError,
} from "@infrastructure/types/client";
import { useMutation, useQuery } from "@vigilio/preact-fetching";
import type { UseTable } from "@vigilio/preact-table";
import type { IconStoreDto, IconUpdateDto } from "../dtos/icon.dto";
import type { IconSchema, IconSchemaFromServer } from "../schemas/icon.schema";

/**
 * index - /api/icon?offset=0&limit=10
 * @method GET
 */
export type IconIndexSecondaryPaginator = "action";
export type IconIndexTable = UseTable<
    IconSchemaFromServer,
    IconIndexSecondaryPaginator
>;
export function iconIndexApi(
    table: IconIndexTable,
    filter: FilterResult<IconSchemaFromServer>
) {
    const query = useQuery<
        PaginatorResult<IconSchemaFromServer>,
        PaginatorResultError
    >(
        "/icon",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));

            if (filter.filters) {
                if (filter.search?.debounce) {
                    data.append("search", filter.search.debounce);
                }
                if (Object.keys(filter.filters).length) {
                    data.append("filters", JSON.stringify(filter.filters));
                }
            }

            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            const response = await fetch(`/api${url}?${data}`);
            const result = await response.json();
            if (!response.ok) {
                throw result;
            }
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    result: data.results,
                    count: data.count,
                    methods: {
                        refetch: query.refetch,
                    },
                });
            },
        }
    );
    return query;
}
/**
 * store - /api/icon
 * @method POST
 */
export function iconStoreApi() {
    return useMutation<IconStoreApiResult, IconStoreDto, IconStoreApiError>(
        "/icon",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw result;
            }
            return result;
        }
    );
}
interface IconStoreApiResult {
    success: true;
    icon: IconSchema;
}
interface IconStoreApiError {
    success: false;
    message: string;
    body: keyof IconStoreDto;
}
/**
 * update - /api/icon/:id
 * @method PUT
 */
export function iconUpdateApi(id: number) {
    return useMutation<IconUpdateApiResult, IconUpdateDto, IconUpdateApiError>(
        `/icon/${id}`,
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw result;
            }

            return result;
        }
    );
}
interface IconUpdateApiResult {
    success: true;
    message: string;
}
interface IconUpdateApiError {
    success: false;
    message: string;
    body: keyof IconStoreDto;
}

/**
 * show - /api/icon/:id
 * @method GET
 */
export function iconShowApi(id: number) {
    return useQuery<IconShowApiResult, IconShowApiError>(
        `/icon/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!response.ok) {
                throw result;
            }
            return result;
        }
    );
}
interface IconShowApiResult {
    success: true;
    icon: IconSchemaFromServer;
}
interface IconShowApiError {
    success: false;
    message: string;
}
/**
 * destroy - /api/icon/:id
 * @method DELETE
 */
export function iconDestroyApi() {
    return useMutation<IconDestroyApi, number, IconDestroyApiError>(
        "/icon",
        async (url, id) => {
            const response = await fetch(`/api${url}/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (!response.ok) {
                throw result;
            }

            return result;
        }
    );
}
interface IconDestroyApi {
    success: true;
    message: string;
}
interface IconDestroyApiError {
    success: false;
    message: string;
}
