import { AdvancedButton } from "./components/advanced-button.component";
import { FilterProvider } from "./components/filter-provider.component";
import { FilterDate } from "./components/filters/filter-date";
import { FilterDatePreset } from "./components/filters/filter-date-preset";
import { FilterMultiselect } from "./components/filters/filter-multiselect";
import { FilterRange } from "./components/filters/filter-range";
import { FilterSearch } from "./components/filters/filter-search";
import { FilterSelect } from "./components/filters/filter-select";
import { Search } from "./components/search.component";
import { ViewToggle } from "./components/view-toggle.component";

export { useFilterSystem } from "./hooks/use-filter-system.hook";
export * from "./libs";
export * from "./types";

const FilterSystem = Object.assign(FilterProvider, {
    search: Search,
    view: ViewToggle,
    filters: AdvancedButton,
    filters_custom: {
        select: FilterSelect,
        multiselect: FilterMultiselect,
        range: FilterRange,
        date_preset: FilterDatePreset,
        date: FilterDate,
        search: FilterSearch,
    },
});

export default FilterSystem;
