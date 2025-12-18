import { formatDateTz } from "@infrastructure/libs";
import { cn } from "@infrastructure/libs/client/helpers";
import { CalendarIconSolid } from "@vigilio/react-icons/fontawesome";
import Button from "../../../button";
import { generateDatePresets } from "../../libs";
import type { DatePreset, FilterGroup, FilterOption } from "../../types";

export interface FilterDatePresetProps<T extends object> {
    group: FilterGroup<T>;
    currentValue: unknown;
    handleFilterChange: (groupId: string, value: unknown) => void;
    handleDatePresetSelect: (groupId: string, preset: DatePreset) => void;
}

export function FilterDatePreset<T extends object>({
    group,
    currentValue,
    handleFilterChange,
    handleDatePresetSelect,
}: FilterDatePresetProps<T>) {
    return (
        <div className="space-y-4">
            {/* Filtros rápidos de fecha */}
            <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Filtros rápidos
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {generateDatePresets().map((preset) => {
                        const isSelected =
                            (
                                currentValue as unknown as {
                                    preset: string;
                                }
                            )?.preset === preset.id;
                        return (
                            <Button
                                key={preset.id}
                                type="button"
                                onClick={() =>
                                    handleDatePresetSelect(
                                        group.key as string,
                                        preset
                                    )
                                }
                                id={group.key as string}
                                className={cn(
                                    "flex gap-2",
                                    isSelected
                                        ? "bg-primary/20 border-primary/20 text-primary fill-primary"
                                        : ""
                                )}
                                variant="outline"
                            >
                                {preset.icon}
                                {preset.label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Separador */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">
                        o selecciona fechas personalizadas
                    </span>
                </div>
            </div>

            {/* Selector de fechas personalizado */}
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
                            value={
                                (
                                    currentValue as unknown as {
                                        from: string;
                                    }
                                )?.from || ""
                            }
                            id={group.key as string}
                            onInput={(e) =>
                                handleFilterChange(group.key as string, {
                                    ...(currentValue as unknown as {
                                        from: string;
                                    }),
                                    from: e.currentTarget.value,
                                    preset: null, // Limpiar preset al usar fechas personalizadas
                                    label: null,
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
                            value={
                                (
                                    currentValue as unknown as {
                                        to: string;
                                    }
                                )?.to || ""
                            }
                            id={group.key as string}
                            onInput={(e) =>
                                handleFilterChange(group.key as string, {
                                    ...(currentValue as unknown as {
                                        to: string;
                                    }),
                                    to: e.currentTarget.value,
                                    preset: null, // Limpiar preset al usar fechas personalizadas
                                    label: null,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            min={
                                (
                                    currentValue as unknown as {
                                        to: string;
                                    }
                                )?.to || ""
                            }
                        />
                    </div>
                </div>

                {/* Mostrar rango seleccionado */}
                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                {((currentValue as any)?.from || (currentValue as any)?.to) && (
                    <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <CalendarIconSolid className="w-4 h-4 fill-primary" />
                            <span>
                                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                {(currentValue as any).preset
                                    ? `${
                                          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                          (currentValue as any).label
                                      }`
                                    : `${
                                          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                          (currentValue as any).from
                                              ? formatDateTz(
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    (currentValue as any).from,
                                                    "DD/MM/YYYY"
                                                )
                                              : "..."
                                      } - ${
                                          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                          (currentValue as any).to
                                              ? formatDateTz(
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    (currentValue as any).to,
                                                    "DD/MM/YYYY"
                                                )
                                              : "..."
                                      }`}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
