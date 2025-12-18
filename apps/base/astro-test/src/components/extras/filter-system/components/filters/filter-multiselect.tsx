import { cn } from "@infrastructure/libs/client/helpers";
import { CheckIconSolid } from "@vigilio/react-icons/fontawesome";
import type { FilterOption } from "../types";

export interface FilterMultiselectProps<T extends object> {
    group: FilterGroup<T>;
    currentValue: unknown;
    handleMultiSelectChange: (
        groupId: string,
        optionId: string,
        checked: boolean
    ) => void;
}

export function FilterMultiselect<T extends object>({
    group,
    currentValue,
    handleMultiSelectChange,
}: FilterMultiselectProps<T>) {
    return (
        <div className="space-y-2 max-h-48 overflow-y-auto">
            {group.options?.map((option) => {
                const isChecked = (
                    (currentValue as unknown as string[]) || []
                ).includes(option.value as string);
                return (
                    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
                    <label
                        key={option.label}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded"
                    >
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                    handleMultiSelectChange(
                                        group.key as string,
                                        option.value as string,
                                        e.currentTarget.checked
                                    )
                                }
                                className="sr-only"
                            />
                            <div
                                className={cn(
                                    "w-4 h-4 border-2 rounded flex items-center justify-center transition-colors",
                                    isChecked
                                        ? "bg-primary border-primary"
                                        : "border-gray-300 hover:border-gray-400"
                                )}
                            >
                                {isChecked && (
                                    <CheckIconSolid className="w-3 h-3 fill-white" />
                                )}
                            </div>
                        </div>
                        <span className="text-sm text-gray-700 flex-1">
                            {option.label}
                        </span>
                        {option.count && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {option.count}
                            </span>
                        )}
                    </label>
                );
            })}
        </div>
    );
}
