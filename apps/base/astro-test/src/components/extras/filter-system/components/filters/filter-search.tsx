import { MagnifyingGlassIconSolid } from "@vigilio/react-icons/fontawesome";
import type { FilterGroup } from "../../types";

export interface FilterSearchProps<T extends object> {
    group: FilterGroup<T>;
    currentValue: unknown;
    handleFilterChange: (groupId: string, value: unknown) => void;
}

export function FilterSearch<T extends object>({
    group,
    currentValue,
    handleFilterChange,
}: FilterSearchProps<T>) {
    return (
        <div className="relative">
            <MagnifyingGlassIconSolid className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder={group.placeholder || "Buscar..."}
                value={(currentValue as unknown as string) || ""}
                onInput={(e) =>
                    handleFilterChange(
                        group.key as string,
                        e.currentTarget.value
                    )
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
        </div>
    );
}
