import { cn } from "@infrastructure/libs/client/helpers";
import type { ChangeEvent } from "preact/compat";

interface SliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    className?: string;
}

export default function Slider({
    className,
    value,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    ...props
}: SliderProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        onValueChange([Number(e.currentTarget.value)]);

    /* % para la parte “llena” */
    const percent = ((value[0] - min) / (max - min)) * 100;

    return (
        <div
            class={cn(
                "relative flex w-full items-center",
                "h-6 cursor-pointer",
                className
            )}
        >
            {/* Track (fondo) */}
            <div class="pointer-events-none absolute h-2 w-full rounded-full bg-muted" />

            {/* Track “lleno” con color primario */}
            <div
                class="pointer-events-none absolute h-2 rounded-full bg-primary"
                style={{ width: `${percent}%` }}
            />

            {/* Input nativo (invisible encima) */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                disabled={disabled}
                class={cn(
                    "absolute inset-0 w-full appearance-none",
                    "bg-transparent focus:outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    /* Thumb genérico (colores con variables) */
                    "[&::-webkit-slider-thumb]:appearance-none",
                    "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:rounded-full",
                    "[&::-webkit-slider-thumb]:bg-primary",
                    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background",
                    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform",
                    "[&::-webkit-slider-thumb]:hover:scale-110",
                    "[&::-webkit-slider-thumb]:focus:ring-2 [&::-webkit-slider-thumb]:ring-ring",
                    "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5",
                    "[&::-moz-range-thumb]:rounded-full",
                    "[&::-moz-range-thumb]:bg-primary",
                    "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background",
                    "[&::-moz-range-thumb]:shadow-md",
                    "[&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:border"
                )}
                {...props}
            />
        </div>
    );
}
