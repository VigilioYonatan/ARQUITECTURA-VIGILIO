import { createContext } from "preact";
import type { useFilterSystem } from "../hooks/use-filter-system.hook";

export const filterContext = createContext<ReturnType<typeof useFilterSystem>>({
    filters: {
        isFilterOpen: false,
        value: {},
        activeFiltersCount: 0,
        filterGroups: [],
        methods: {
            openFilters: () => {},
            applyFilters: () => {},
            closeFilters: () => {},
            clearFilters: () => {},
        },
    },
    typeView: {
        value: "table",
        methods: {
            toggleTypeView: () => {},
        },
    },
    search: {
        value: "",
        debounce: "",
        methods: {
            handleInputChange: () => {},
            clearSearch: () => {},
        },
    },
});
