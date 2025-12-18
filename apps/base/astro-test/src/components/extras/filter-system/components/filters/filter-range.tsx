import type { FilterGroup } from "../../types";

export interface FilterRangeProps<T extends object> {
    group: FilterGroup<T>;
    currentValue: unknown;
    handleFilterChange: (groupId: string, value: unknown) => void;
}

export function FilterRange<T extends object>({
    group,
    currentValue,
    handleFilterChange,
}: FilterRangeProps<T>) {
    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="flex-1">
                    <label
                        htmlFor={group.key as string}
                        className="block text-xs text-gray-600 mb-1"
                    >
                        Mínimo
                    </label>
                    <input
                        type="number"
                        min={group.min}
                        max={group.max}
                        value={
                            (
                                currentValue as unknown as {
                                    min: number;
                                }
                            )?.min || ""
                        }
                        onInput={(e) =>
                            handleFilterChange(group.key as string, {
                                ...(currentValue as unknown as {
                                    min: number;
                                }),
                                min: e.currentTarget.value
                                    ? Number(e.currentTarget.value)
                                    : undefined,
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
                        Máximo
                    </label>
                    <input
                        type="number"
                        min={group.min}
                        max={group.max}
                        value={
                            (
                                currentValue as unknown as {
                                    max: number;
                                }
                            )?.max || ""
                        }
                        id={group.key as string}
                        onInput={(e) =>
                            handleFilterChange(group.key as string, {
                                ...(currentValue as unknown as {
                                    max: number;
                                }),
                                max: e.currentTarget.value
                                    ? Number(e.currentTarget.value)
                                    : undefined,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
