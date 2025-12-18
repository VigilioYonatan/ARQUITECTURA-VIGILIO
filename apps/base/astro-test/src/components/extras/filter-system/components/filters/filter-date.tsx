import type { FilterOption } from "../types";

export interface FilterDateProps<T extends object> {
    group: FilterGroup<T>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    currentValue: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    handleFilterChange: (groupId: string, value: any) => void;
}

export function FilterDate<T extends object>({
    group,
    currentValue,
    handleFilterChange,
}: FilterDateProps<T>) {
    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="flex-1">
                    <label
                        htmlFor={group.key as string}
                        className="block text-xs text-gray-600 mb-1"
                    >
                        Desde
                    </label>
                    <input
                        type="date"
                        id={group.key as string}
                        value={currentValue?.from || ""}
                        onInput={(e) =>
                            handleFilterChange(group.key as string, {
                                ...currentValue,
                                from: e.currentTarget.value,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>
                <div className="flex-1">
                    <label
                        htmlFor={group.key as string}
                        className="block text-xs text-gray-600 mb-1"
                    >
                        Hasta
                    </label>
                    <input
                        type="date"
                        id={group.key as string}
                        value={currentValue?.to || ""}
                        onInput={(e) =>
                            handleFilterChange(group.key as string, {
                                ...currentValue,
                                to: e.currentTarget.value,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
