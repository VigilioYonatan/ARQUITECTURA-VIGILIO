import { useComputed, useSignal } from "@preact/signals";
import { useDebounce } from "@vigilio/preact-paginator";
import type { FilterGroup } from "../types";

export function useFilterSystem<T extends object>(
    filterGroups: FilterGroup<T>[]
) {
    const isFilterOpen = useSignal(false);
    const activeFilters = useSignal<Record<keyof T, unknown>>(
        {} as Record<keyof T, unknown>
    );
    const typeView = useSignal<"table" | "list">("list");
    const query = useSignal<string>("");
    const debounce = useDebounce(query.value);

    function openFilters() {
        isFilterOpen.value = true;
    }

    function closeFilters() {
        isFilterOpen.value = false;
    }

    function applyFilters(filters: Record<keyof T, unknown>) {
        activeFilters.value = filters;
    }

    function clearFilters() {
        activeFilters.value = {} as Record<keyof T, unknown>;
    }

    function toggleTypeView(value: "table" | "list") {
        typeView.value = value;
    }

    const activeFiltersCount = useComputed(() => {
        return Object.values(activeFilters.value).filter((value) => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === "string") return value.trim() !== "";
            if (typeof value === "object" && value !== null) {
                return Object.values(value).some(
                    (v) => v !== null && v !== undefined && v !== ""
                );
            }
            return value !== null && value !== undefined;
        }).length;
    });

    function handleInputChange(value: string) {
        query.value = value;
    }

    function clearSearch() {
        query.value = "";
    }

    return {
        filters: {
            isFilterOpen: isFilterOpen.value,
            value: activeFilters.value,
            activeFiltersCount: activeFiltersCount.value,
            filterGroups,
            methods: {
                openFilters,
                applyFilters,
                closeFilters,
                clearFilters,
            },
        },
        typeView: {
            value: typeView.value,
            methods: {
                toggleTypeView,
            },
        },
        search: {
            value: query.value,
            debounce,
            methods: {
                handleInputChange,
                clearSearch,
            },
        },
    };
}
