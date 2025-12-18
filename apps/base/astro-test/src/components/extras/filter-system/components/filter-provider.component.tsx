import type { FilterResult } from "@infrastructure/libs/client/helpers";
import type { JSX } from "preact";
import { filterContext } from "../context/filter.context";
import { useFilterSystem } from "../hooks/use-filter-system.hook";
import type { FilterGroup } from "../types";

export interface FilterProviderProps<T extends object> {
    children: (filterSystem: FilterResult<T>) => JSX.Element | JSX.Element[];
    filterGroups: FilterGroup<T>[];
}

export function FilterProvider<T extends object>({
    children,
    filterGroups,
}: FilterProviderProps<T>) {
    const filterSystem = useFilterSystem(
        filterGroups.filter(
            (group) => typeof group.show === "undefined" || group.show
        )
    );
    return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        <filterContext.Provider value={filterSystem as any}>
            {children({
                search: {
                    value: filterSystem.search.value,
                    debounce: filterSystem.search.debounce,
                },
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                filters: filterSystem.filters.value as any,
                typeView: filterSystem.typeView.value,
            })}
        </filterContext.Provider>
    );
}
