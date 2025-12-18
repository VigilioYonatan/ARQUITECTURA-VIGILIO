import type { FilterGroup, FilterOption } from "../types";

export interface FilterSelectProps<T extends object> {
    group: FilterGroup<T>;
    currentValue: unknown;
    handleFilterChange: (groupId: string, value: unknown) => void;
}

export function FilterSelect<T extends object>({
    group,
    currentValue,
    handleFilterChange,
}: FilterSelectProps<T>) {
    return (
        <select
            value={(currentValue as unknown as string) || ""}
            onChange={(e) =>
                handleFilterChange(group.key as string, e.currentTarget.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
            <option value="">Seleccionar...</option>
            {group.options?.map((option) => (
                <option key={option.label} value={option.value as string}>
                    {option.label} {option.count && `(${option.count})`}
                </option>
            ))}
        </select>
    );
}
