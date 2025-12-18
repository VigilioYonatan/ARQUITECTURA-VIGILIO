import { cn } from "@infrastructure/libs/client/helpers";
import { useComputed, useSignal } from "@preact/signals";
import {
    ChevronDownIconSolid,
    RotateIconSolid,
} from "@vigilio/react-icons/fontawesome";
import { useContext } from "preact/hooks";
import Button from "../../button";
import Card from "../../card";
import { filterContext } from "../context/filter.context";
import type { DatePreset, FilterGroup } from "../types";
import { FilterDate } from "./filters/filter-date";
import { FilterDatePreset } from "./filters/filter-date-preset";
import { FilterMultiselect } from "./filters/filter-multiselect";
import { FilterRange } from "./filters/filter-range";
import { FilterSearch } from "./filters/filter-search";
import { FilterSelect } from "./filters/filter-select";

export interface FilterProps<T extends object> {
    className?: string;
}

export function Filter<T extends object>({ className }: FilterProps<T>) {
    const context = useContext(filterContext);
    const filters = useSignal<Record<string, unknown>>(context.filters.value);
    const expandedGroups = useSignal<Set<string>>(new Set());

    const handleFilterChange = (groupId: string, value: unknown) => {
        const isNumber =
            !Number.isNaN(Number(value)) ||
            value === "true" ||
            value === "false";
        filters.value = {
            ...filters.value,
            [groupId]: isNumber ? JSON.parse(value as string) : value,
        };
    };

    const handleMultiSelectChange = (
        groupId: string,
        optionId: string,
        checked: boolean
    ) => {
        filters.value = {
            ...filters.value,
            [groupId]: (() => {
                const currentValues =
                    (filters.value[groupId] as string[]) || [];
                if (checked) {
                    return [...currentValues, optionId];
                }
                return currentValues.filter((id: string) => id !== optionId);
            })(),
        };
    };

    const handleDatePresetSelect = (groupId: string, preset: DatePreset) => {
        filters.value = {
            ...filters.value,
            [groupId]: {
                preset: preset.id,
                from: preset.value.from.toISOString().split("T")[0],
                to: preset.value.to.toISOString().split("T")[0],
                label: preset.label,
            },
        };
    };

    const toggleGroup = (groupId: string) => {
        const newSet = new Set(expandedGroups.value);
        if (newSet.has(groupId)) {
            newSet.delete(groupId);
        } else {
            newSet.add(groupId);
        }
        expandedGroups.value = newSet;
    };

    const clearAllFilters = () => {
        filters.value = {};
    };

    const applyFilters = () => {
        context.filters.methods.applyFilters(filters.value);
        context.filters.methods.closeFilters();
    };

    const activeFiltersCount = useComputed(() => {
        return Object.values(filters.value).filter((value) => {
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

    const renderFilterGroup = (group: FilterGroup<T>) => {
        const isExpanded = expandedGroups.value.has(group.key as string);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const currentValue = filters.value[group.key as string] as any;

        return (
            <div
                key={group.key as string}
                className="border border-gray-200 rounded-lg bg-white"
            >
                <button
                    type="button"
                    onClick={() => toggleGroup(group.key as string)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                    <span className="font-medium text-gray-900">
                        {group.label}
                    </span>
                    <div className="flex items-center gap-2">
                        {currentValue && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                {Array.isArray(currentValue)
                                    ? currentValue.length
                                    : currentValue.preset
                                    ? currentValue.label
                                    : "1"}
                            </span>
                        )}
                        <ChevronDownIconSolid
                            className={cn(
                                "w-4 h-4 text-gray-500 transition-transform",
                                isExpanded && "rotate-180"
                            )}
                        />
                    </div>
                </button>

                {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        {group.type === "search" && (
                            <FilterSearch
                                group={group}
                                currentValue={currentValue}
                                handleFilterChange={handleFilterChange}
                            />
                        )}

                        {group.type === "select" && group.options && (
                            <FilterSelect
                                group={group}
                                currentValue={currentValue}
                                handleFilterChange={handleFilterChange}
                            />
                        )}

                        {group.type === "multiselect" && group.options && (
                            <FilterMultiselect
                                group={group}
                                currentValue={currentValue}
                                handleMultiSelectChange={
                                    handleMultiSelectChange
                                }
                            />
                        )}

                        {group.type === "range" && (
                            <FilterRange
                                group={group}
                                currentValue={currentValue}
                                handleFilterChange={handleFilterChange}
                            />
                        )}

                        {group.type === "date-preset" && (
                            <FilterDatePreset
                                group={group}
                                currentValue={currentValue}
                                handleDatePresetSelect={handleDatePresetSelect}
                                handleFilterChange={handleFilterChange}
                            />
                        )}

                        {group.type === "date" && (
                            <FilterDate
                                group={group}
                                currentValue={currentValue}
                                handleFilterChange={handleFilterChange}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={cn(
                "w-full max-w-3xl max-h-[90vh] overflow-hidden",
                className
            )}
        >
            <Card.content className="space-y-4 max-h-[55vh] overflow-y-auto !p-0 my-2">
                {context.filters.filterGroups.map(renderFilterGroup)}
            </Card.content>

            <Card className=" p-4 flex items-center justify-between gap-2">
                <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 bg-transparent"
                    type="button"
                >
                    <RotateIconSolid className="w-4 h-4" />
                    Limpiar todo
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={context.filters.methods.closeFilters}
                        type="button"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={applyFilters}
                        className="bg-primary hover:bg-primary"
                        type="button"
                    >
                        Aplicar filtros ({activeFiltersCount.value})
                    </Button>
                </div>
            </Card>
        </div>
    );
}
